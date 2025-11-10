import React, { Suspense } from "react"
import { Form, FormProps } from "src/app/components/Form"
import { LabeledTextField } from "src/app/components/LabeledTextField"

import { z } from "zod"
import FileUpload from "../../components/FileUpload"
export { FORM_ERROR } from "src/app/components/Form"

export function ProductForm<S extends z.ZodType<any, any>>(props: FormProps<S>) {
  return (
    <Form<S> {...props}>
      <LabeledTextField name="name" label="Name" placeholder="Name" className="mb-2" />
      <LabeledTextField
        name="description"
        label="Description"
        placeholder="Description"
        className="mb-2"
      />
      <FileUpload name="image" label="Image" className="mb-4" />
    </Form>
  )
}
