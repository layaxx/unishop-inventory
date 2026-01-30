import { resolver } from "@blitzjs/rpc"
import db from "db"

export default resolver.pipe(resolver.authorize(), async () => {
  const count = await db.inventoryEntry.count()

  return count > 0
})
