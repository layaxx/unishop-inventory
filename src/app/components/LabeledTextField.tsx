import { forwardRef, PropsWithoutRef } from "react"
import { useField, useFormikContext, ErrorMessage } from "formik"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Field, FieldLabel } from "@/components/ui/field"

export interface LabeledTextFieldProps
  extends PropsWithoutRef<React.JSX.IntrinsicElements["input"]> {
  /** Field name. */
  name: string
  /** Field label. */
  label: string
  /** Field type. Doesn't include radio buttons and checkboxes */
  type?: "text" | "password" | "email" | "number"
  outerProps?: PropsWithoutRef<React.JSX.IntrinsicElements["div"]>
  skipLabel?: boolean
}

export const LabeledTextField = forwardRef<HTMLInputElement, LabeledTextFieldProps>(
  ({ skipLabel, name, label, outerProps, ...props }, ref) => {
    const [input] = useField(name)
    const { isSubmitting } = useFormikContext()

    return (
      <div {...outerProps}>
        <Field>
          {!skipLabel && <FieldLabel htmlFor={`input-field-${name}`}>{label}</FieldLabel>}

          <Input
            id={`input-field-${name}`}
            {...input}
            disabled={isSubmitting}
            {...props}
            ref={ref}
          />
        </Field>

        <ErrorMessage name={name}>
          {(msg) => (
            <div role="alert" style={{ color: "red" }}>
              {msg}
            </div>
          )}
        </ErrorMessage>
      </div>
    )
  }
)

LabeledTextField.displayName = "LabeledTextField"

export default LabeledTextField
