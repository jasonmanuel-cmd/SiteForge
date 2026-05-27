import { PrismaClient } from '@prisma/client'
import { hashSync } from 'bcryptjs'
import { randomUUID } from 'crypto'

const prisma = new PrismaClient()

async function main() {
  const existing = await prisma.user.findUnique({ where: { email: 'blunts954@gmail.com' } })
  if (existing) {
    console.log('Demo user already exists, skipping seed.')
    return
  }

  const accountId = randomUUID()
  const userId = randomUUID()

  await prisma.account.create({
    data: {
      id: accountId,
      companyName: 'SiteForge Demo Co.',
      planType: 'pro',
      status: 'active',
    },
  })

  await prisma.user.create({
    data: {
      id: userId,
      accountId,
      email: 'blunts954@gmail.com',
      passwordHash: hashSync('coaijay1989', 10),
      firstName: 'Jason',
      lastName: 'Manuel',
      role: 'owner',
      phoneNumber: '+1-555-0100',
      isActive: true,
    },
  })

  console.log('Seed complete: demo user created.')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
