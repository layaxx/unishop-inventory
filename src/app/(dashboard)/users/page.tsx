import { Metadata } from "next"
import { Suspense } from "react"
import { UsersList } from "./components/UsersList"
import Breadcrumbs from "../../components/layout/Breadcrumbs"
import { Role } from "@/db"
import { useAuthenticatedBlitzContext } from "../../blitz-server"

export const metadata: Metadata = {
  title: "Users",
  description: "List of users",
}

export default async function Page() {
  await useAuthenticatedBlitzContext({
    role: Role.ADMIN,
    redirectTo: "/insufficient-permission?from=/users",
  })

  return (
    <Breadcrumbs page="Users" pre={[]}>
      <div>
        <Suspense fallback={<div>Loading...</div>}>
          <UsersList />
        </Suspense>
      </div>
    </Breadcrumbs>
  )
}
