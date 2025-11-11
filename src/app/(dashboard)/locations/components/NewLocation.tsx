"use client"
import { FORM_ERROR, LocationForm } from "./LocationForm"
import { CreateLocationSchema } from "../schemas"
import { invalidateQuery, useMutation } from "@blitzjs/rpc"
import createLocation from "../mutations/createLocation"
import { useRouter } from "next/navigation"
import getLocations from "../queries/getLocations"

export function NewLocation() {
  const [createLocationMutation] = useMutation(createLocation)
  const router = useRouter()
  return (
    <LocationForm
      submitText="Create Location"
      initialValues={{ name: "" }}
      schema={CreateLocationSchema}
      onSubmit={async (values) => {
        try {
          const location = await createLocationMutation(values)
          invalidateQuery(getLocations)
          router.push(`/locations/${location.id}`)
        } catch (error: any) {
          console.error(error)
          return {
            [FORM_ERROR]: error.toString(),
          }
        }
      }}
    />
  )
}
