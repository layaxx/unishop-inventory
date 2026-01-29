"use client"

import React from "react"
import createProductModifierTypeMutation from "../../mutations/createProductModifierType"
import { CreateProductModifierTypeSchema } from "../../schemas"
import { invalidateQuery, useMutation } from "@blitzjs/rpc"
import getProductModifierTypes from "../../queries/getProductModifierTypes"
import { Button } from "@/components/ui/button"
import { validateZodSchema } from "blitz"
import { Formik } from "formik"
import { PlusIcon, XIcon } from "lucide-react"
import LabeledTextFieldWithSubmit from "@/src/app/components/LabeledTextFieldWithSubmit"
import getProductVariants from "../../queries/getProductVariants"
import getProductVariantsWithStocksAndValues from "../../queries/getProductVariantsWithStocksAndValues"

const AddModifier: React.FC<{ productId: number }> = ({ productId }) => {
  const [showForm, setShowForm] = React.useState(false)

  const [createProductModifierType] = useMutation(createProductModifierTypeMutation)

  return (
    <div className="ml-2">
      {showForm ? (
        <Formik
          schema={CreateProductModifierTypeSchema}
          initialValues={{ name: "", productId }}
          validate={validateZodSchema(CreateProductModifierTypeSchema)}
          onSubmit={async (values) => {
            try {
              await createProductModifierType(values)
              invalidateQuery(getProductModifierTypes)
              invalidateQuery(getProductVariants)
              invalidateQuery(getProductVariantsWithStocksAndValues)
              setShowForm(false)
            } catch (error: any) {
              console.error(error)
            }
          }}
        >
          {({ handleSubmit }) => (
            <form onSubmit={handleSubmit} className="form flex gap-2 items-center">
              <LabeledTextFieldWithSubmit
                name="name"
                label="Name"
                placeholder="Name"
                submitButtonChildren={<PlusIcon />}
              />
              <Button
                onClick={() => setShowForm(false)}
                variant="outline"
                size="icon"
                aria-label="Add Modifier Type"
              >
                <XIcon />
              </Button>
            </form>
          )}
        </Formik>
      ) : (
        <Button
          onClick={() => setShowForm(true)}
          variant="outline"
          size="icon"
          aria-label="Add Modifier Type"
        >
          <PlusIcon />
        </Button>
      )}
    </div>
  )
}

export default AddModifier
