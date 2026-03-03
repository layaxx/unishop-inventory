import db, { Role } from "db"
import { SecurePassword } from "@blitzjs/auth/secure-password"

export default async function signup(input: { password: string; email: string }, ctx: any) {
  const blitzContext = ctx
  const hashedPassword = await SecurePassword.hash(input.password as string)
  const email = input.email as string
  const user = await db.user.create({
    data: { email, hashedPassword, role: Role.NEW },
  })

  await blitzContext.session.$create({
    userId: user.id,
    role: Role.NEW,
  })

  return { userId: blitzContext.session.userId, ...user, email: input.email }
}
