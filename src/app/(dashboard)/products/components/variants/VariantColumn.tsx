"use client"

import { ColumnDef } from "@tanstack/react-table"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type VariantWithStock = {
  value: string
  totalStock: number
  order: number
}

export const columns: ColumnDef<VariantWithStock>[] = [
  {
    accessorKey: "value",
    header: "Name",
  },
  {
    accessorKey: "totalStock",
    header: "Stock (total)",
  },
  {
    accessorKey: "order",
    header: "order",
  },
]
