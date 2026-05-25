/**
 * API Middleware
 * Multi-tenant scoping and authentication
 */

import { NextRequest, NextResponse } from 'next/server'
import { verifyToken, extractTokenFromHeader, JWTPayload } from './auth'

export interface AuthenticatedRequest extends NextRequest {
  user?: JWTPayload
}

/**
 * Middleware to authenticate requests
 * Usage in API routes:
 *
 * export async function GET(request: NextRequest) {
 *   const auth = await requireAuth(request)
 *   if (!auth.user) return auth.response
 *
 *   // auth.user is now available
 * }
 */
export async function requireAuth(request: NextRequest): Promise<{
  user: JWTPayload | null
  response: NextResponse | null
}> {
  const authHeader = request.headers.get('authorization')
  const token = extractTokenFromHeader(authHeader)

  if (!token) {
    return {
      user: null,
      response: NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      ),
    }
  }

  const user = verifyToken(token)

  if (!user) {
    return {
      user: null,
      response: NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      ),
    }
  }

  return { user, response: null }
}

/**
 * Helper to get accountId from authenticated user
 * All database queries should be scoped by accountId for multi-tenancy
 */
export function getAccountId(user: JWTPayload | null): string | null {
  return user?.accountId || null
}

/**
 * Check if user has required role
 */
export function hasRole(user: JWTPayload, allowedRoles: string[]): boolean {
  return allowedRoles.includes(user.role)
}

/**
 * Role-based access control
 */
export async function requireRole(
  request: NextRequest,
  allowedRoles: string[]
): Promise<{
  user: JWTPayload | null
  response: NextResponse | null
}> {
  const auth = await requireAuth(request)

  if (!auth.user) {
    return auth
  }

  if (!hasRole(auth.user, allowedRoles)) {
    return {
      user: null,
      response: NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      ),
    }
  }

  return auth
}
