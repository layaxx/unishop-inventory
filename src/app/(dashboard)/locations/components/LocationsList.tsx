"use client"

import { useQuery } from "@blitzjs/rpc"
import Link from "next/link"
import getLocations from "../queries/getLocations"
import { DataTable } from "@/src/app/components/DataTable"

const ITEMS_PER_PAGE = 100

export const LocationsList = () => {
  const [res] = useQuery(getLocations, {
    orderBy: { id: "asc" },
    take: ITEMS_PER_PAGE,
  })

  const { locations } = res ?? { locations: [] }

  return (
    <div>
      <DataTable
        columns={[
          { accessorKey: "id", header: "ID" },
          {
            accessorKey: "name",
            header: "Name",
            cell: ({ row }) => (
              <Link className="underline" href={`/locations/${row.original.id}`}>
                {row.original.name}
              </Link>
            ),
          },
        ]}
        data={locations}
      />
    </div>
  )
}
