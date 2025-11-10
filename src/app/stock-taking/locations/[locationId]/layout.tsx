import Breadcrumbs from "../../../components/layout/Breadcrumbs"

export default async function SubLayout({ children }: { children: React.ReactNode }) {
  return Breadcrumbs({
    page: "Location",
    pre: [{ name: "Stocktaking", url: "/stock-taking" }],
    children,
  })
}
