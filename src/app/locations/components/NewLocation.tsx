"use client";
import { FORM_ERROR, LocationForm } from "./LocationForm";
import { CreateLocationSchema } from "../schemas";
import { useMutation } from "@blitzjs/rpc";
import createLocation from "../mutations/createLocation";
import { useRouter } from "next/navigation";

export function New__ModelName() {
  const [createLocationMutation] = useMutation(createLocation);
  const router = useRouter();
  return (
    <LocationForm
      submitText="Create Location"
      schema={CreateLocationSchema}
      onSubmit={async (values) => {
        try {
          const location = await createLocationMutation(values);
          router.push(`/locations/${location.id}`);
        } catch (error: any) {
          console.error(error);
          return {
            [FORM_ERROR]: error.toString(),
          };
        }
      }}
    />
  );
}
