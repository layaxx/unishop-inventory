import { resolver } from "@blitzjs/rpc"
import db from "db"

export default resolver.pipe(resolver.authorize(), async () => {
  return db.pDF.findMany({ orderBy: { createdAt: "desc" }, select: { id: true, createdAt: true } })
})
