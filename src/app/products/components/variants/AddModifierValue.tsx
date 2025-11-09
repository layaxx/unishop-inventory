"use client"
import Form, { FORM_ERROR } from "@/src/app/components/Form"
import LabeledTextField from "@/src/app/components/LabeledTextField"
import React from "react"
import createProductModifierValueMutation from "../../mutations/createProductModifierValue"
import { CreateProductModifierValueSchema } from "../../schemas"
import { invalidateQuery, useMutation } from "@blitzjs/rpc"
import getProductModifierTypes from "../../queries/getProductModifierTypes"
import { Button } from "@/components/ui/button"
import getProductVariants from "../../queries/getProductVariants"

const AddModifier: React.FC<{ modifierTypeId: number }> = ({ modifierTypeId }) => {
  const [showForm, setShowForm] = React.useState(false)

  const [createProductModifierValue] = useMutation(createProductModifierValueMutation)

  return (
    <>
      {showForm ? (
        <Form
          submitText="Create ModifierValue"
          schema={CreateProductModifierValueSchema}
          initialValues={{ value: "", modifierTypeId }}
          onSubmit={async (values) => {
            try {
              await createProductModifierValue(values)
              invalidateQuery(getProductModifierTypes)
              invalidateQuery(getProductVariants)
            } catch (error: any) {
              console.error(error)
              return {
                [FORM_ERROR]: error.toString(),
              }
            }
            setShowForm(false)
          }}
        >
          <LabeledTextField name="value" label="ModifierValue" placeholder="Value" />
        </Form>
      ) : (
        <Button onClick={() => setShowForm(true)} size="sm" variant="outline">
          Add ModifierValue
        </Button>
      )}
    </>
  )
}

export default AddModifier
