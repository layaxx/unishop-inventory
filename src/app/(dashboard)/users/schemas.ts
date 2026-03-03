import { Role } from "@/db"
import { z } from "zod"

export const UpdateUserSchema = z.object({
  id: z.number(),
  role: z.nativeEnum(Role),
})
