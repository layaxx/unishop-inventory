import dotenv from "dotenv"
import "../src/app/blitz-server"
import db from "@/db"

beforeAll(async () => {
  dotenv.config()
  await db.$reset()
})
