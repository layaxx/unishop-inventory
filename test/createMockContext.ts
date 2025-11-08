import { Ctx } from "blitz"
import { vi } from "vitest"

export const mockCtx = {
  session: {
    $authorize: vi.fn(),
    userId: 1,
  },
} as unknown as Ctx
