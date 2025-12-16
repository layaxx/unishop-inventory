import { Button } from "@/components/ui/button"
import Link from "next/link"

const CurrentReport = () => {
  return (
    <>
      <h2 className="mb-4 text-lg font-semibold">Generate Report today</h2>

      <Link download href="/api/reports/generate-current">
        <Button variant="secondary">Download current Report</Button>
      </Link>
    </>
  )
}

export default CurrentReport
