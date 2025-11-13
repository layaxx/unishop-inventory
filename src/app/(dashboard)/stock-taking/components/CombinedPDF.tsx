import { Button } from "@/components/ui/button"
import { useMutation, useQuery } from "@blitzjs/rpc"
import makeCombinedPDFMutation from "../mutations/makeCombinedPDF"
import getLastStocktakingProcesses from "../queries/getLastStocktakingProcesses"
import dayjs from "dayjs"

const CombinedPDF = () => {
  const [makeCombinedPDF] = useMutation(makeCombinedPDFMutation)
  const [audits] = useQuery(getLastStocktakingProcesses, {})

  const canGenerateCombinedPDF = audits?.every((audit) => {
    const auditDate = dayjs(audit.createdAt)
    const today = dayjs()
    return auditDate.isSame(today, "day")
  })

  const handleOnClick = async () => {
    try {
      const result = await makeCombinedPDF({})
      // Trigger download
      const link = document.createElement("a")
      link.href = result.downloadLink
      link.download = "combined_stocktaking.pdf"
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (error) {
      console.error("Error generating combined PDF:", error)
    }
  }

  return (
    <>
      <p>
        Combined Reports can only be generated on the same day that stocktaking reports where
        generated for every location.
      </p>
      <Button onClick={handleOnClick} disabled={!canGenerateCombinedPDF}>
        Make combined PDF
      </Button>
    </>
  )
}

export default CombinedPDF
