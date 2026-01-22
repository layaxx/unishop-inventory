"use client"
import { LabeledTextField } from "src/app/components/LabeledTextField"
import { Form, FORM_ERROR } from "src/app/components/Form"
import signup from "../mutations/signup"
import { Signup } from "../validations"
import { useMutation } from "@blitzjs/rpc"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export const SignupForm = () => {
  const [signupMutation] = useMutation(signup, { throwOnError: false })
  const router = useRouter()

  return (
    <div>
      <Form
        submitText="Create Account"
        schema={Signup}
        initialValues={{ email: "", password: "" }}
        onSubmit={async (values) => {
          console.log("Signing up", values)
          try {
            await signupMutation(values)
            router.refresh()
            router.push("/")
          } catch (error: any) {
            if (error.code === "P2002" && error.meta?.target?.includes("email")) {
              // This error comes from Prisma
              return { email: "This email is already being used" }
            } else {
              return { [FORM_ERROR]: error.toString() }
            }
          }
        }}
      >
        <div className="flex flex-col gap-6 mb-4">
          <Card>
            <CardHeader>
              <CardTitle>Sign Up for an Account</CardTitle>
              <CardDescription>Enter your email below to create your account</CardDescription>
            </CardHeader>
            <CardContent>
              <LabeledTextField name="email" label="Email" placeholder="Email" />
              <LabeledTextField
                name="password"
                label="Password"
                placeholder="Password"
                type="password"
              />
            </CardContent>
          </Card>
        </div>
      </Form>

      <div style={{ marginTop: "1rem" }}>
        Or <Link href="/login">Log in</Link> with an existing account
      </div>
    </div>
  )
}
