"use client"

import { useQuery } from "@blitzjs/rpc"
import Link from "next/link"
import { DataTable } from "@/src/app/components/DataTable"
import getUsers from "../queries/getUsers"

const ITEMS_PER_PAGE = 100

export const UsersList = () => {
  const [res] = useQuery(getUsers, {
    orderBy: { id: "asc" },
    take: ITEMS_PER_PAGE,
  })

  const { users } = res ?? { users: [] }

  return (
    <div className="md:max-w-1/2 w-full">
      <DataTable
        columns={[
          { accessorKey: "id", header: "ID" },
          { accessorKey: "email", header: "Email" },
          { accessorKey: "role", header: "Role" },
        ]}
        data={users}
      />
    </div>
  )
}
