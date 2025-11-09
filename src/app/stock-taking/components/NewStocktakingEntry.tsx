import Form, { FORM_ERROR } from "../../components/Form"
import LabeledTextField from "../../components/LabeledTextField"
import LocationSelector from "../../components/LocationSelector"
import VariantSelector from "../../components/VariantSelector"
import { CreateInventoryEntrySchema } from "../schemas"
import { invalidateQuery, useMutation } from "@blitzjs/rpc"
import createInventoryEntryMutation from "../mutations/createInventoryEntry"
import getInventoryEntries from "../queries/getInventoryEntries"

const NewStocktakingEntry = () => {
  const [createInventoryEntry] = useMutation(createInventoryEntryMutation)

  return (
    <Form
      submitText="Create Stocktaking Entry"
      initialValues={{ quantity: 0, locationId: -1, variantId: -1, description: "" }}
      schema={CreateInventoryEntrySchema}
      onSubmit={async (values) => {
        try {
          await createInventoryEntry(values)
          invalidateQuery(getInventoryEntries)
        } catch (error: any) {
          console.error(error)
          return {
            [FORM_ERROR]: error.toString(),
          }
        }
      }}
    >
      <div className="flex flex-wrap space-x-4 mb-4">
        <div>
          <LocationSelector name="locationId" label="Location" />
        </div>
        <div>
          <VariantSelector name="variantId" label="Variant" />
        </div>
      </div>
      <div className="flex flex-wrap space-x-4">
        <div>
          <LabeledTextField name="quantity" label="Quantity" type="number" />
        </div>
        <div className="min-w-1/4">
          <LabeledTextField name="description" label="Description" />
        </div>
      </div>
    </Form>
  )
}

export default NewStocktakingEntry
