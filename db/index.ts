import { enhancePrisma, NotFoundError } from "blitz"
import { PrismaClient } from "@prisma/client"
import SuperJson from "superjson"

const EnhancedPrisma = enhancePrisma(PrismaClient)

export * from "@prisma/client"
const db = new EnhancedPrisma()
export default db

SuperJson.registerClass(NotFoundError)
