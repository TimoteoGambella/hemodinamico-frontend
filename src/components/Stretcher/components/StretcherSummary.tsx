import SummarySchema from '../../Table/constants/StretcherSummarySchema'
import CustomTable from '../../Table'

interface StretcherSummaryProps {
  stretcher: PopulatedStretcher[] | null
  currentTab: TabsKeys
}

export default function StretcherSummary(props: StretcherSummaryProps) {
  const { stretcher, currentTab } = props
  const patientId = stretcher ? stretcher[0].patientId?._id || null : null

  return (
    <>
      <div style={{ marginBottom: '1.5rem' }}>
        <CustomTable.User patientId={patientId} />
      </div>
      <div>
        <CustomTable.Monitoring
          currentTab={currentTab}
          source={stretcher?.sort((a, b) => b.__v - a.__v) || []}
          schema={SummarySchema}
          scroll={{ y: 280 }}
        />
      </div>
    </>
  )
}
