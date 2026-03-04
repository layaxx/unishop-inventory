import { Metadata } from "next"
import Breadcrumbs from "../../components/layout/Breadcrumbs"

export const metadata: Metadata = {
  title: "Insufficient Permissions",
  description: "You do not have permission to view this page",
}

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export default async function Page({ searchParams }: PageProps) {
  const lastPage = (await searchParams).from || "the page you were trying to access"

  return (
    <Breadcrumbs page="Error" pre={[]}>
      <div>
        <h1 className="text-4xl font-bold">Insufficient Permissions</h1>
        <p>You do not have permission to view {lastPage}.</p>
      </div>
    </Breadcrumbs>
  )
}
