import { CreateInventoryEntrySchema } from "../schemas"
import { invalidateQuery, useMutation } from "@blitzjs/rpc"
import createInventoryEntryMutation from "../mutations/createInventoryEntry"
import getInventoryEntries from "../queries/getInventoryEntries"
import { FC } from "react"
import getUntrackedVariants from "../queries/getUntrackedVariants"
import isActiveInventory from "../queries/isActiveInventory"
import Form, { FORM_ERROR } from "@/src/app/components/Form"
import LabeledTextField from "@/src/app/components/LabeledTextField"
import VariantSelector from "@/src/app/components/VariantSelector"

const NewStocktakingEntry: FC<{ locationId: number; innerRef: React.Ref<any> }> = ({
  locationId,
  innerRef,
}) => {
  const [createInventoryEntry] = useMutation(createInventoryEntryMutation)

  return (
    <Form
      innerRef={innerRef}
      submitText="Create Stocktaking Entry"
      initialValues={{ quantity: 0, locationId, variantId: -1, description: "" }}
      schema={CreateInventoryEntrySchema}
      onSubmit={async (values, actions) => {
        try {
          await createInventoryEntry(values)
          invalidateQuery(getInventoryEntries)
          invalidateQuery(getUntrackedVariants)
          invalidateQuery(isActiveInventory)
          actions.resetForm()
          return {}
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
          <VariantSelector name="variantId" label="Variant" />
        </div>
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
