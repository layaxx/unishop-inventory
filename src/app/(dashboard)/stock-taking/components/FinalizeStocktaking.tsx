import { Button } from "@/components/ui/button"
import { invalidateQuery, useMutation, useQuery } from "@blitzjs/rpc"
import { FC } from "react"
import getUntrackedVariants from "../queries/getUntrackedVariants"
import getLocation from "../../locations/queries/getLocation"
import finalizeStocktaking from "../mutations/finalizeStocktaking"
import { useRouter } from "next/navigation"
import isActiveInventory from "../queries/isActiveInventory"

const FinalizeStocktaking: FC<{ locationId: number }> = ({ locationId }) => {
  const [untrackedVariants] = useQuery(getUntrackedVariants, { where: { locationId } })
  const [location] = useQuery(getLocation, { id: locationId })
  const [finalize] = useMutation(finalizeStocktaking)
  const router = useRouter()

  const hasUntrackedVariants = (untrackedVariants?.length ?? 0) > 0

  return (
    <div className="mt-8">
      {hasUntrackedVariants && (
        <p className="text-red-700">
          You can only finalize this process if an entry for every variant has been created.
        </p>
      )}
      <Button
        className="w-full"
        disabled={hasUntrackedVariants}
        onClick={async () => {
          try {
            await finalize({ locationId })
            router.push("/stock-taking")
            invalidateQuery(isActiveInventory)
          } catch (error) {
            console.warn(error)
          }
        }}
      >
        Finalize Stocktaking for {location?.name}
      </Button>
    </div>
  )
}

export default FinalizeStocktaking
