import { resolver } from "@blitzjs/rpc"
import db from "db"

export default resolver.pipe(resolver.authorize(), async () => {
  const entries = await db.inventoryEntry.findMany()

  return entries
})
