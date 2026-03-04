import { resolver } from "@blitzjs/rpc"
import db, { Role } from "db"
import { UpdateUserSchema } from "../schemas"

export default resolver.pipe(
  resolver.zod(UpdateUserSchema),
  resolver.authorize(Role.ADMIN),
  async ({ id, ...data }) => {
    const user = await db.user.update({ where: { id }, data })

    return user
  }
)
