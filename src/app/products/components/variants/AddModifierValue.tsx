"use client"
import Form, { FORM_ERROR } from "@/src/app/components/Form"
import LabeledTextField from "@/src/app/components/LabeledTextField"
import { useRouter } from "next/navigation"
import React from "react"
import createProductModifierValueMutation from "../../mutations/createProductModifierValue"
import { CreateProductModifierValueSchema } from "../../schemas"
import { invalidateQuery, useMutation } from "@blitzjs/rpc"
import getProductModifierType from "../../queries/getProductModifierType"
import getProductModifierTypes from "../../queries/getProductModifierTypes"

const AddModifier: React.FC<{ modifierTypeId: number }> = ({ modifierTypeId }) => {
  const [showForm, setShowForm] = React.useState(false)

  const [createProductModifierValue] = useMutation(createProductModifierValueMutation)

  const router = useRouter()

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
        </Form>
      ) : (
        <button onClick={() => setShowForm(true)}>Add ModifierValue</button>
      )}
    </>
  )
}

export default AddModifier
