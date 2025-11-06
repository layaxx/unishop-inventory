"use client"
import Form, { FORM_ERROR } from "@/src/app/components/Form"
import LabeledTextField from "@/src/app/components/LabeledTextField"
import { useRouter } from "next/navigation"
import React from "react"
import createProductModifierTypeMutation from "../../mutations/createProductModifierType"
import { CreateProductModifierTypeSchema } from "../../schemas"
import { invalidateQuery, useMutation } from "@blitzjs/rpc"
import getProductModifierType from "../../queries/getProductModifierType"

const AddModifier: React.FC<{ productId: number }> = ({ productId }) => {
  const [showForm, setShowForm] = React.useState(false)

  const [createProductModifierType] = useMutation(createProductModifierTypeMutation)

  const router = useRouter()

  return (
    <div>
      <h3>No Variants Found</h3>
      {showForm ? (
        <Form
          submitText="Create ModifierType"
          schema={CreateProductModifierTypeSchema}
          initialValues={{ name: "", productId }}
          onSubmit={async (values) => {
            try {
              await createProductModifierType(values)
              invalidateQuery(getProductModifierType)
            } catch (error: any) {
              console.error(error)
              return {
                [FORM_ERROR]: error.toString(),
              }
            }
          }}
        >
          <LabeledTextField name="name" label="Name" placeholder="Name" />
        </Form>
      ) : (
        <button onClick={() => setShowForm(true)}>Add Modifier</button>
      )}
    </div>
  )
}

export default AddModifier
