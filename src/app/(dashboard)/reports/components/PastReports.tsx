import { useQuery } from "@blitzjs/rpc"
import getPastStocktakingReports from "../../stock-taking/queries/getPastStocktakingReports"

const PastReports = () => {
  const [reports] = useQuery(getPastStocktakingReports, {})

  return (
    <div className="mt-8">
      <h2 className="mb-4 text-lg font-semibold">Past Stocktaking Reports</h2>
      {reports?.length === 0 && <p>No past reports available.</p>}
      <ul className="list-disc list-inside">
        {reports?.map((report: any) => (
          <li key={report.id} className="mb-2">
            <a
              href={`/api/stock-taking/pdf/${report.id}/download`}
              download={`stocktaking_report_${report.id}.pdf`}
              className="text-blue-600 underline"
            >
              Report ID: {report.id} - Created At: {new Date(report.createdAt).toLocaleDateString()}
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default PastReports
