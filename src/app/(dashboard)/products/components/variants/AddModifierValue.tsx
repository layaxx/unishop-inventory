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
import { PlusIcon, XIcon } from "lucide-react"
import { Formik } from "formik"
import { validateZodSchema } from "blitz"
import LabeledTextFieldWithSubmit from "@/src/app/components/LabeledTextFieldWithSubmit"

const AddModifier: React.FC<{ modifierTypeId: number }> = ({ modifierTypeId }) => {
  const [showForm, setShowForm] = React.useState(false)

  const [createProductModifierValue] = useMutation(createProductModifierValueMutation)

  return (
    <>
      {showForm ? (
        <Formik
          schema={CreateProductModifierValueSchema}
          validate={validateZodSchema(CreateProductModifierValueSchema)}
          initialValues={{ value: "", modifierTypeId }}
          onSubmit={async (values) => {
            try {
              await createProductModifierValue(values)
              await Promise.all([
                invalidateQuery(getProductModifierTypes),
                invalidateQuery(getProductVariants),
              ])
              setShowForm(false)
            } catch (error: any) {
              console.error(error)
            }
          }}
        >
          {({ handleSubmit }) => (
            <form onSubmit={handleSubmit} className="form flex gap-2 items-center">
              <LabeledTextFieldWithSubmit
                name="value"
                label="Value"
                placeholder="Value"
                submitButtonChildren={<PlusIcon />}
              />
              <Button
                onClick={() => setShowForm(false)}
                variant="outline"
                size="icon"
                aria-label="Add Modifier Value"
              >
                <XIcon />
              </Button>
            </form>
          )}
        </Formik>
      ) : (
        <Button onClick={() => setShowForm(true)} variant="outline" aria-label="Add Modifier Value">
          Add Modifier Value
          <PlusIcon />
        </Button>
      )}
    </>
  )
}

export default AddModifier
