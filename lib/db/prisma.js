import { PrismaClient } from '../generated/prisma'

const globalForPrisma = globalThis

const createPrismaClient = () => {
  return new PrismaClient()
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}

export default prisma
