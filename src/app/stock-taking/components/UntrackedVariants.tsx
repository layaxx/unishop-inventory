import { useQuery } from "@blitzjs/rpc"
import { FC, RefObject } from "react"
import getUntrackedVariants from "../queries/getUntrackedVariants"
import { DataTable } from "../../components/DataTable"
import { getName } from "@/src/lib/variant"
import { Button } from "@/components/ui/button"

const UntrackedVariants: FC<{
  locationId: number
  formRef: RefObject<{ setFieldValue: (arg0: string, arg1: number) => void } | null>
}> = ({ locationId, formRef }) => {
  const [result] = useQuery(getUntrackedVariants, { where: { locationId } })

  return (
    <>
      <h2 className="mt-4 mb-2 font-bold text-4xl">Untracked Variants</h2>
      <DataTable
        data={result ?? []}
        columns={[
          {
            header: "Variant",
            accessorFn(variant) {
              return getName(variant)
            },
            cell({ row }) {
              return (
                <Button
                  variant="ghost"
                  onClick={() => {
                    formRef?.current?.setFieldValue("variantId", row.original.id)
                  }}
                >
                  {row.getValue("Variant")}
                </Button>
              )
            },
          },
        ]}
      />
    </>
  )
}

export default UntrackedVariants
