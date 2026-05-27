import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { successResponse } from '@/lib/api-response'
import { formatErrorResponse, AuthError } from '@/lib/error-handler'
import jwt from 'jsonwebtoken'

export async function GET(request: NextRequest) {
  try {
    // Extract and verify JWT token
    const authHeader = request.headers.get('authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      throw new AuthError('Missing or invalid authorization header')
    }

    const token = authHeader.slice(7)
    let decoded: any
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET!)
    } catch (error) {
      throw new AuthError('Invalid or expired token')
    }

    const accountId = decoded.accountId
    if (!accountId) {
      throw new AuthError('Missing accountId in token')
    }

    // Fetch estimates from database
    const estimates = await prisma.estimate.findMany({
      where: { accountId },
      orderBy: { createdAt: 'desc' },
      take: 100,
    })

    return NextResponse.json(
      successResponse(estimates.map(est => ({
        id: est.id,
        trade: est.trade,
        inputs: est.inputs,
        materials: est.materials,
        labor: est.labor,
        subtotal: est.subtotal,
        taxableSubtotal: est.taxableSubtotal,
        markup: est.markup,
        tax: est.tax,
        total: est.total,
        aiGenerated: est.aiGenerated,
        createdAt: est.createdAt.toISOString(),
        result: {
          materials: est.materials,
          labor: est.labor,
          subtotal: est.subtotal,
          taxableSubtotal: est.taxableSubtotal,
          markup: est.markup,
          tax: est.tax,
          total: est.total,
        },
      })))
    )
  } catch (error) {
    const { response, statusCode } = formatErrorResponse(error)
    return NextResponse.json(response, { status: statusCode })
  }
}
