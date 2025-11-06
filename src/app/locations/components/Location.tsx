"use client"
import { useMutation, useQuery } from "@blitzjs/rpc"
import Link from "next/link"
import { useRouter } from "next/navigation"
import deleteLocation from "../mutations/deleteLocation"
import getLocation from "../queries/getLocation"

export const Location = ({ locationId }: { locationId: number }) => {
  const router = useRouter()
  const [deleteLocationMutation] = useMutation(deleteLocation)
  const [location, { isLoading }] = useQuery(getLocation, { id: locationId })

  if (isLoading) return <div>Loading...</div>

  if (!location) return <div>Location not found</div>

  return (
    <>
      <div>
        <h1>Project {location.id}</h1>
        <pre>{JSON.stringify(location, null, 2)}</pre>

        <Link href={`/locations/${location.id}/edit`}>Edit</Link>

        <button
          type="button"
          onClick={async () => {
            if (window.confirm("This will be deleted")) {
              await deleteLocationMutation({ id: location.id })
              router.push("/locations")
            }
          }}
          style={{ marginLeft: "0.5rem" }}
        >
          Delete
        </button>
      </div>
    </>
  )
}
