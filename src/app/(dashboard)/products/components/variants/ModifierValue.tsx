import Form, { FORM_ERROR } from "@/src/app/components/Form"
import LabeledTextField from "@/src/app/components/LabeledTextField"
import { invalidateQuery, useMutation } from "@blitzjs/rpc"
import type { ProductModifierType, ProductModifierValue } from "db"
import updateProductModifierValueMutation from "../../mutations/updateProductModifierValue"
import React from "react"
import { UpdateProductModifierValueSchema } from "../../schemas"
import getProductModifierType from "../../queries/getProductModifierType"
import deleteProductModifierValueMutation from "../../mutations/deleteProductModifierValue"
import getProductModifierTypes from "../../queries/getProductModifierTypes"

const ModifierValue: React.FC<{ value: ProductModifierValue; type: ProductModifierType }> = ({
  value,
  type,
}) => {
  const [showForm, setShowForm] = React.useState(false)
  const [updateProductModifierValue] = useMutation(updateProductModifierValueMutation)
  const [deleteProductModifierValue] = useMutation(deleteProductModifierValueMutation)

  const handleOnDelete = async () => {
    try {
      if (!confirm("Are you sure you want to delete this modifier value?")) {
        return
      }

      await deleteProductModifierValue({ id: value.id })
      invalidateQuery(getProductModifierTypes)
    } catch (error) {
      console.error("Failed to delete modifier value:", error)
    }
  }

  if (showForm) {
    return (
      <Form
        submitText="Update ModifierValue"
        resetText="reset"
        schema={UpdateProductModifierValueSchema}
        initialValues={value}
        onSubmit={async (values) => {
          try {
            await updateProductModifierValue(values)
            invalidateQuery(getProductModifierTypes)
          } catch (error: any) {
            console.error(error)
            return {
              [FORM_ERROR]: error.toString(),
            }
          }
          setShowForm(false)
        }}
      >
        <LabeledTextField name="value" label="Value" placeholder="Value" />
        <LabeledTextField name="order" label="Order" type="number" />
      </Form>
    )
  }

  return (
    <div>
      {type.name}: {value.value} <button onClick={() => setShowForm((prev) => !prev)}>Edit</button>{" "}
      <button onClick={handleOnDelete}>Delete</button>
    </div>
  )
}

export default ModifierValue
