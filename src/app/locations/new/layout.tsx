import Breadcrumbs from "../../components/layout/Breadcrumbs"

export default async function SubLayout({ children }: { children: React.ReactNode }) {
  return Breadcrumbs({
    page: "New Location",
    pre: [{ name: "Locations", url: "/locations" }],
    children,
  })
}
