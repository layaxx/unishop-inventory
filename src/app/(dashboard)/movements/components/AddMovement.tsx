"use client"

import { Button } from "@/components/ui/button"
import LabeledTextField from "@/src/app/components/LabeledTextField"
import LocationSelector from "@/src/app/components/LocationSelector"
import VariantSelector from "@/src/app/components/VariantSelector"
import { validateZodSchema } from "blitz"
import { Formik, Form, FieldArray } from "formik"
import { useState } from "react"
import { MovementSchema } from "../schemas"
import { useMutation } from "@blitzjs/rpc"
import addMovementMutation from "../mutations/addMovement"
import CurrentStockLevel from "./CurrentStockLevel"

const AddMovement = () => {
  const [formError, setFormError] = useState<string | null>(null)
  const [addMovement] = useMutation(addMovementMutation)

  return (
    <>
      <Formik
        initialValues={{ reason: "", from: -1, to: -1, variants: [{ id: -1, quantity: 0 }] }}
        validate={validateZodSchema(MovementSchema)}
        onSubmit={async (values, formik) => {
          if (values.from === values.to) {
            setFormError("From and To locations cannot be the same.")
            return
          }

          try {
            await addMovement(values)
            formik.resetForm()
          } catch (error) {
            setFormError((error as Error).message)
            return
          }
          console.log("Movement logged")
        }}
      >
        {({ values }) => (
          <Form>
            <div>
              <h1 className="text-3xl font-bold mb-4">Add Movement</h1>
            </div>

            {formError && (
              <div role="alert" style={{ color: "red" }}>
                {formError}
              </div>
            )}

            <div className="flex gap-4 mb-4">
              <div>
                <p>From</p>
                <LocationSelector label="from" name="from" />
              </div>
              <div>
                <p>To</p>
                <LocationSelector label="to" name="to" />
              </div>
            </div>

            <div className="w-96 mb-4">
              <LabeledTextField label="Reason" name="reason" type="text" />
            </div>

            <FieldArray
              name="variants"
              render={(arrayHelpers) => (
                <div>
                  {values.variants && values.variants.length > 0 ? (
                    values.variants.map((_variant, index) => (
                      <div key={index}>
                        <div className="flex gap-4 mb-4">
                          <div>
                            <VariantSelector label="variant" name={`variants.${index}.id`} />
                          </div>
                          <LabeledTextField
                            label="quantity"
                            name={`variants.${index}.quantity`}
                            type="number"
                          />
                          <div>
                            <Button
                              type="button"
                              onClick={() => arrayHelpers.remove(index)}
                              variant="ghost"
                            >
                              -
                            </Button>

                            <Button
                              type="button"
                              onClick={() => arrayHelpers.insert(index, { id: -1, quantity: 0 })}
                              variant="ghost"
                            >
                              +
                            </Button>
                          </div>
                          <CurrentStockLevel
                            variantId={values.variants[index].id}
                            locationId={values.from}
                          />
                        </div>
                      </div>
                    ))
                  ) : (
                    <Button type="button" onClick={() => arrayHelpers.push("")}>
                      Add a Product variant
                    </Button>
                  )}

                  <div className="mt-4">
                    <Button type="submit">Log Movement</Button>
                  </div>
                </div>
              )}
            />
          </Form>
        )}
      </Formik>
    </>
  )
}

export default AddMovement
