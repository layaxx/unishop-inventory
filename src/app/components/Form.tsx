import { useState, ReactNode, PropsWithoutRef } from "react"
import { Formik, FormikHelpers, FormikProps } from "formik"
import { validateZodSchema } from "blitz"
import { z } from "zod"
import { Button } from "@/components/ui/button"

export interface FormProps<S extends z.ZodType<any, any>>
  extends Omit<PropsWithoutRef<React.JSX.IntrinsicElements["form"]>, "onSubmit"> {
  /** All your form fields */
  children?: ReactNode
  /** Text to display in the submit button */
  submitText?: string
  resetText?: string
  schema?: S
  onSubmit: (
    values: z.infer<S>,
    actions: FormikHelpers<z.infer<S>>
  ) => Promise<void | OnSubmitResult>
  initialValues?: FormikProps<z.infer<S>>["initialValues"]
  innerRef?: React.Ref<any>
}

interface OnSubmitResult {
  FORM_ERROR?: string
  [prop: string]: any
}

export const FORM_ERROR = "FORM_ERROR"

export function Form<S extends z.ZodType<any, any>>({
  children,
  submitText,
  resetText,
  schema,
  initialValues,
  onSubmit,
  innerRef,
  ...props
}: FormProps<S>) {
  const [formError, setFormError] = useState<string | null>(null)
  return (
    <Formik
      initialValues={initialValues || {}}
      validate={validateZodSchema(schema)}
      innerRef={innerRef}
      onSubmit={async (values, actions) => {
        const { FORM_ERROR, ...otherErrors } = (await onSubmit(values, actions)) || {}

        if (FORM_ERROR) {
          setFormError(FORM_ERROR)
        }

        if (Object.keys(otherErrors).length > 0) {
          actions.setErrors(otherErrors)
        }
      }}
    >
      {({ handleSubmit, isSubmitting }) => (
        <form onSubmit={handleSubmit} className="form" {...props}>
          {/* Form fields supplied as children are rendered here */}
          {children}

          {formError && (
            <div role="alert" style={{ color: "red" }}>
              {formError}
            </div>
          )}

          {submitText && (
            <Button type="submit" disabled={isSubmitting}>
              {submitText}
            </Button>
          )}

          {resetText && (
            <Button type="reset" disabled={isSubmitting}>
              {resetText}
            </Button>
          )}
        </form>
      )}
    </Formik>
  )
}

export default Form
