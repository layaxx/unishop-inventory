import Breadcrumbs from "@/src/app/components/layout/Breadcrumbs"

export default async function SubLayout({ children }: { children: React.ReactNode }) {
  return Breadcrumbs({
    page: "Product",
    pre: [{ name: "Products", url: "/products" }],
    createNew: "/products/new",
    children,
  })
}
