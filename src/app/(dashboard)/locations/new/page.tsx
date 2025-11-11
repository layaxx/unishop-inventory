import { Metadata } from "next"
import { Suspense } from "react"
import { NewLocation } from "../components/NewLocation"

export const metadata: Metadata = {
  title: "New Project",
  description: "Create a new project",
}

export default function Page() {
  return (
    <div>
      <h1 className="text-4xl font-bold mb-2">Add New Location</h1>
      <Suspense fallback={<div>Loading...</div>}>
        <NewLocation />
      </Suspense>
    </div>
  )
}
