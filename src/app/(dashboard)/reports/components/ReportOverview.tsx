"use client"

import CurrentReport from "./CurrentReport"
import PastReports from "./PastReports"

const ReportOverview = () => {
  return (
    <>
      <h1 className="text-3xl font-bold mb-4">Report Overview</h1>

      <CurrentReport />

      <PastReports />
    </>
  )
}

export default ReportOverview
