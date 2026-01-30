"use client"

import { Button } from "@/components/ui/button"
import LabeledTextField from "@/src/app/components/LabeledTextField"
import LocationSelector from "@/src/app/components/LocationSelector"
import VariantSelector from "@/src/app/components/VariantSelector"
import { validateZodSchema } from "blitz"
import { Formik, Form, FieldArray } from "formik"
import { useState } from "react"
import { MovementSchema } from "../schemas"
import { invalidateQuery, useMutation } from "@blitzjs/rpc"
import addMovementMutation from "../mutations/addMovement"
import CurrentStockLevel from "./CurrentStockLevel"
import getRecentMovements from "../queries/getRecentMovements"
import { XIcon } from "lucide-react"
import { FieldLabel } from "@/components/ui/field"

const AddMovement = () => {
  const [formError, setFormError] = useState<string | null>(null)
  const [addMovement] = useMutation(addMovementMutation)

  return (
    <>
      <Formik
        initialValues={{ reason: "", from: -1, to: -1, variants: [{ id: -1, quantity: 1 }] }}
        validate={validateZodSchema(MovementSchema)}
        onSubmit={async (values, formik) => {
          if (values.from === values.to) {
            setFormError("From and To locations cannot be the same.")
            return
          }
          if (values.variants.length === 0) {
            setFormError("Please add at least one product variant to move.")
            return
          }

          try {
            await addMovement(values)
            formik.resetForm()
            invalidateQuery(getRecentMovements)
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
              <div className="flex flex-col gap-4">
                <FieldLabel>From</FieldLabel>
                <LocationSelector label="from" name="from" />
              </div>
              <div className="flex flex-col gap-4">
                <FieldLabel>To</FieldLabel>
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
                  {values.variants.map((_variant, index) => (
                    <div key={index}>
                      <div className="flex gap-2 mb-4 items-center">
                        <FieldLabel className="w-6">{index + 1}.</FieldLabel>
                        <div>
                          <VariantSelector label="variant" name={`variants.${index}.id`} />
                        </div>
                        <LabeledTextField
                          label="quantity"
                          name={`variants.${index}.quantity`}
                          type="number"
                          outerProps={{ className: "w-24" }}
                          skipLabel
                        />
                        <Button
                          type="button"
                          onClick={() => arrayHelpers.remove(index)}
                          variant="ghost"
                          size="icon"
                          title="Remove Entry"
                        >
                          <XIcon />
                        </Button>
                        <CurrentStockLevel
                          variantId={values.variants[index].id}
                          locationId={values.from}
                        />
                      </div>
                    </div>
                  ))}

                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => arrayHelpers.push({ id: -1, quantity: 1 })}
                  >
                    Add Entry
                  </Button>
                </div>
              )}
            />
            <div className="mt-4">
              <Button type="submit">Log Movement</Button>
            </div>
          </Form>
        )}
      </Formik>
    </>
  )
}

export default AddMovement
