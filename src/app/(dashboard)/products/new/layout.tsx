import Breadcrumbs from "@/src/app/components/layout/Breadcrumbs"

export default async function SubLayout({ children }: { children: React.ReactNode }) {
  return Breadcrumbs({
    page: "Create Product",
    pre: [{ name: "Products", url: "/products" }],
    children,
  })
}
