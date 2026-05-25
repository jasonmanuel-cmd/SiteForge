/**
 * Prisma Client Singleton
 * Using stub implementation to work around Prisma engine download issues
 */

import prismaClient from './prisma-stub'

// Cast to any to match expected Prisma types
export const prisma = prismaClient as any
