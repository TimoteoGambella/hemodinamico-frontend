import SummarySchema from '../../Table/constants/StretcherSummarySchema'
import MontoringSummary from '../../Table/components/MontoringSummary'
import CustomTable from '../../Table'

interface StretcherSummaryProps {
  stretcher: PopulatedStretcher[] | null
}

export default function StretcherSummary({ stretcher }: StretcherSummaryProps) {
  const patientId = stretcher ? stretcher[0].patientId?._id || null : null

  return (
    <>
      <div style={{ marginBottom: '1.5rem' }}>
        <CustomTable.User patientId={patientId} />
      </div>
      <div>
        <MontoringSummary schema={SummarySchema} source={stretcher || []} />
      </div>
    </>
  )
}
