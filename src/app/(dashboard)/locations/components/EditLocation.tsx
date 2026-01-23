"use client"
import { Suspense } from "react"
import updateLocation from "../mutations/updateLocation"
import getLocation from "../queries/getLocation"
import { UpdateLocationSchema } from "../schemas"
import { FORM_ERROR, LocationForm } from "./LocationForm"
import { useMutation, useQuery } from "@blitzjs/rpc"
import { useRouter } from "nextjs-toploader/app"

export const EditLocation = ({ locationId }: { locationId: number }) => {
  const [location, { setQueryData }] = useQuery(
    getLocation,
    { id: locationId },
    {
      // This ensures the query never refreshes and overwrites the form data while the user is editing.
      staleTime: Infinity,
    }
  )
  const [updateLocationMutation] = useMutation(updateLocation)
  const router = useRouter()

  if (!location) return <div>Location not found</div>

  return (
    <>
      <div>
        <h1>Edit Location {location.id}</h1>
        <pre>{JSON.stringify(location, null, 2)}</pre>
        <Suspense fallback={<div>Loading...</div>}>
          <LocationForm
            submitText="Update Location"
            schema={UpdateLocationSchema}
            initialValues={location}
            onSubmit={async (values) => {
              try {
                const updated = await updateLocationMutation({
                  ...values,
                  id: location.id,
                })
                await setQueryData(updated)
                router.refresh()
              } catch (error: any) {
                console.error(error)
                return {
                  [FORM_ERROR]: error.toString(),
                }
              }
            }}
          />
        </Suspense>
      </div>
    </>
  )
}
