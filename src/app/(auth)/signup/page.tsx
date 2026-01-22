import { ErrorBoundary } from "@blitzjs/next"
import { SignupForm } from "../components/SignupForm"

export default function SignUpPage() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <ErrorBoundary fallback={<p>no working</p>}>
          <SignupForm />
        </ErrorBoundary>
      </div>
    </div>
  )
}
