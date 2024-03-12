import CustomTable from '../../Table'

interface StretcherSummaryProps {
  stretcher: PopulatedStretcher
}

export default function StretcherSummary({ stretcher }: StretcherSummaryProps) {
  return (
    <>
      <div style={{ marginBottom: '1.5rem' }}>
        <CustomTable.User patientId={stretcher.patientId?._id || null} />
      </div>
    </>
  )
}
