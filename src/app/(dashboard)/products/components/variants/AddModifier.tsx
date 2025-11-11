"use client"
import Form, { FORM_ERROR } from "@/src/app/components/Form"
import LabeledTextField from "@/src/app/components/LabeledTextField"
import React from "react"
import createProductModifierTypeMutation from "../../mutations/createProductModifierType"
import { CreateProductModifierTypeSchema } from "../../schemas"
import { invalidateQuery, useMutation } from "@blitzjs/rpc"
import getProductModifierTypes from "../../queries/getProductModifierTypes"
import { Button } from "@/components/ui/button"

const AddModifier: React.FC<{ productId: number }> = ({ productId }) => {
  const [showForm, setShowForm] = React.useState(false)

  const [createProductModifierType] = useMutation(createProductModifierTypeMutation)

  return (
    <div className="mt-4">
      {showForm ? (
        <Form
          submitText="Create ModifierType"
          schema={CreateProductModifierTypeSchema}
          initialValues={{ name: "", productId }}
          onSubmit={async (values) => {
            try {
              await createProductModifierType(values)
              invalidateQuery(getProductModifierTypes)
              setShowForm(false)
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
        <Button onClick={() => setShowForm(true)} size="sm" variant="outline">
          Add Modifier Type
        </Button>
      )}
    </div>
  )
}

export default AddModifier
