import { ROLES_WITH_READ_ACCESS } from "@/src/app/(auth)/validations"
import { resolver } from "@blitzjs/rpc"
import db from "db"

export default resolver.pipe(resolver.authorize(ROLES_WITH_READ_ACCESS), async () => {
  return db.pDF.findMany({ orderBy: { createdAt: "desc" }, select: { id: true, createdAt: true } })
})
