import { resolver } from "@blitzjs/rpc"
import db from "db"
import { UpdateLocationSchema } from "../schemas"
import { ROLES_WITH_WRITE_ACCESS } from "@/src/app/(auth)/validations"

export default resolver.pipe(
  resolver.zod(UpdateLocationSchema),
  resolver.authorize(ROLES_WITH_WRITE_ACCESS),
  async ({ id, ...data }) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const location = await db.location.update({ where: { id }, data })

    return location
  }
)
