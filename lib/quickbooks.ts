/**
 * QuickBooks Integration Service
 * Handles OAuth and API calls to QuickBooks Online
 */

import OAuthClient from 'intuit-oauth'
import axios from 'axios'
import { prisma } from './prisma'

const QB_CLIENT_ID = process.env.QB_CLIENT_ID || ''
const QB_CLIENT_SECRET = process.env.QB_CLIENT_SECRET || ''
const QB_REDIRECT_URI = process.env.QB_REDIRECT_URI || ''
const QB_ENVIRONMENT = process.env.QB_ENVIRONMENT || 'sandbox'

/**
 * Create OAuth client
 */
export function createOAuthClient() {
  return new OAuthClient({
    clientId: QB_CLIENT_ID,
    clientSecret: QB_CLIENT_SECRET,
    environment: QB_ENVIRONMENT,
    redirectUri: QB_REDIRECT_URI,
  })
}

/**
 * Generate authorization URL for QuickBooks connect
 */
export function getAuthorizationUrl(): string {
  const oauthClient = createOAuthClient()
  return oauthClient.authorizeUri({
    scope: [OAuthClient.scopes.Accounting, OAuthClient.scopes.OpenId],
    state: 'testState', // In production, use a random state token
  })
}

/**
 * Exchange authorization code for tokens
 */
export async function exchangeCodeForTokens(
  code: string,
  accountId: string
): Promise<void> {
  const oauthClient = createOAuthClient()

  const authResponse = await oauthClient.createToken(code)
  const token = authResponse.getJson()

  // Save tokens to account
  await prisma.account.update({
    where: { id: accountId },
    data: {
      qbRealmId: token.realmId,
      qbAccessToken: token.access_token,
      qbRefreshToken: token.refresh_token,
      qbTokenExpiry: new Date(Date.now() + token.expires_in * 1000),
    },
  })
}

/**
 * Refresh access token if expired
 */
export async function refreshAccessToken(accountId: string): Promise<string> {
  const account = await prisma.account.findUnique({
    where: { id: accountId },
    select: {
      qbAccessToken: true,
      qbRefreshToken: true,
      qbTokenExpiry: true,
    },
  })

  if (!account?.qbRefreshToken) {
    throw new Error('QuickBooks not connected')
  }

  // Check if token is still valid
  if (
    account.qbTokenExpiry &&
    account.qbTokenExpiry > new Date(Date.now() + 5 * 60 * 1000)
  ) {
    return account.qbAccessToken!
  }

  // Refresh token
  const oauthClient = createOAuthClient()
  oauthClient.setToken({
    refresh_token: account.qbRefreshToken,
    access_token: account.qbAccessToken || '',
  })

  const authResponse = await oauthClient.refresh()
  const token = authResponse.getJson()

  // Save new tokens
  await prisma.account.update({
    where: { id: accountId },
    data: {
      qbAccessToken: token.access_token,
      qbRefreshToken: token.refresh_token,
      qbTokenExpiry: new Date(Date.now() + token.expires_in * 1000),
    },
  })

  return token.access_token
}

/**
 * Get QuickBooks API base URL
 */
function getApiBaseUrl(environment: string): string {
  return environment === 'sandbox'
    ? 'https://sandbox-quickbooks.api.intuit.com'
    : 'https://quickbooks.api.intuit.com'
}

/**
 * Create a bill (vendor invoice) in QuickBooks
 */
export async function createBill(accountId: string, invoiceData: {
  vendorRef: string
  totalAmt: number
  lineItems: Array<{
    description: string
    amount: number
    accountRef?: string
  }>
  txnDate?: string
  dueDate?: string
}): Promise<any> {
  const accessToken = await refreshAccessToken(accountId)

  const account = await prisma.account.findUnique({
    where: { id: accountId },
    select: { qbRealmId: true },
  })

  if (!account?.qbRealmId) {
    throw new Error('QuickBooks Realm ID not found')
  }

  const bill = {
    VendorRef: {
      value: invoiceData.vendorRef,
    },
    Line: invoiceData.lineItems.map((item, index) => ({
      Id: String(index + 1),
      Amount: item.amount,
      DetailType: 'AccountBasedExpenseLineDetail',
      Description: item.description,
      AccountBasedExpenseLineDetail: {
        AccountRef: {
          value: item.accountRef || '1', // Default expense account
        },
      },
    })),
    TxnDate: invoiceData.txnDate || new Date().toISOString().split('T')[0],
    DueDate: invoiceData.dueDate,
  }

  const response = await axios.post(
    `${getApiBaseUrl(QB_ENVIRONMENT)}/v3/company/${account.qbRealmId}/bill`,
    bill,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    }
  )

  return response.data.Bill
}

/**
 * Get list of vendors from QuickBooks
 */
export async function getVendors(accountId: string): Promise<any[]> {
  const accessToken = await refreshAccessToken(accountId)

  const account = await prisma.account.findUnique({
    where: { id: accountId },
    select: { qbRealmId: true },
  })

  if (!account?.qbRealmId) {
    throw new Error('QuickBooks Realm ID not found')
  }

  const response = await axios.get(
    `${getApiBaseUrl(QB_ENVIRONMENT)}/v3/company/${account.qbRealmId}/query?query=SELECT * FROM Vendor`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: 'application/json',
      },
    }
  )

  return response.data.QueryResponse?.Vendor || []
}

/**
 * Get company info from QuickBooks
 */
export async function getCompanyInfo(accountId: string): Promise<any> {
  const accessToken = await refreshAccessToken(accountId)

  const account = await prisma.account.findUnique({
    where: { id: accountId },
    select: { qbRealmId: true },
  })

  if (!account?.qbRealmId) {
    throw new Error('QuickBooks Realm ID not found')
  }

  const response = await axios.get(
    `${getApiBaseUrl(QB_ENVIRONMENT)}/v3/company/${account.qbRealmId}/companyinfo/${account.qbRealmId}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: 'application/json',
      },
    }
  )

  return response.data.CompanyInfo
}
