import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@radix-ui/react-separator"
import { Plus } from "lucide-react"
import Link from "next/link"
import { FC, Fragment, PropsWithChildren } from "react"

const Breadcrumbs: FC<
  PropsWithChildren<{ page: string; pre: Array<{ name: string; url: string }>; createNew?: string }>
> = ({ children, page, pre, createNew }) => (
  <>
    <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
      <div className="flex items-center gap-2 px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            {pre.map((crumb) => (
              <Fragment key={crumb.url}>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink asChild>
                    <Link href={crumb.url}>{crumb.name}</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
              </Fragment>
            ))}
            <BreadcrumbItem>
              <BreadcrumbPage>{page}</BreadcrumbPage>
            </BreadcrumbItem>

            {createNew && (
              <BreadcrumbItem>
                <BreadcrumbLink>
                  <Link href={createNew}>
                    <Plus />
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
            )}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </header>
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">{children}</div>
  </>
)

export default Breadcrumbs
