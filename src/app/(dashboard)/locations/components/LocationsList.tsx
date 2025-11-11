"use client"
import { usePaginatedQuery } from "@blitzjs/rpc"
import Link from "next/link"
import { useRouter } from "next/navigation"
import getLocations from "../queries/getLocations"
import { useSearchParams } from "next/navigation"
import { usePathname } from "next/navigation"
import { Route } from "next"
import { ButtonGroup } from "@/components/ui/button-group"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/src/app/components/DataTable"

const ITEMS_PER_PAGE = 100

export const LocationsList = () => {
  const searchparams = useSearchParams()!
  const page = Number(searchparams.get("page")) || 0
  const [res] = usePaginatedQuery(getLocations, {
    where: {},
    orderBy: { id: "asc" },
    skip: ITEMS_PER_PAGE * page,
    take: ITEMS_PER_PAGE,
  })

  const { locations, hasMore } = res ?? { locations: [], hasMore: false }
  const router = useRouter()
  const pathname = usePathname()

  const goToPreviousPage = () => {
    const params = new URLSearchParams(searchparams)
    params.set("page", (page - 1).toString())
    router.push((pathname + "?" + params.toString()) as Route)
  }
  const goToNextPage = () => {
    const params = new URLSearchParams(searchparams)
    params.set("page", (page + 1).toString())
    router.push((pathname + "?" + params.toString()) as Route)
  }

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

      <ButtonGroup>
        <Button disabled={page === 0} onClick={goToPreviousPage} variant="outline">
          Previous
        </Button>
        <Button disabled={!hasMore} onClick={goToNextPage} variant="outline">
          Next
        </Button>
      </ButtonGroup>
    </div>
  )
}
