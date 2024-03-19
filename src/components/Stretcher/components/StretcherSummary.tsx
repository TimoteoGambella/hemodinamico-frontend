import StretcherSummarySchema from '../../Table/constants/StretcherSummarySchema'
import CustomTable from '../../Table'

interface StretcherSummaryProps {
  stretcher: PopulatedStretcher[] | null
  currentTab: TabsKeys
  patient: string | null
}

export default function StretcherSummary(props: StretcherSummaryProps) {
  const { stretcher, currentTab, patient } = props

  return (
    <>
      <div style={{ marginBottom: '1.5rem' }}>
        <CustomTable.User patientId={patient} />
      </div>
      <div>
        <CustomTable.Monitoring
          currentTab={currentTab}
          source={stretcher?.sort((a, b) => b.__v - a.__v) || []}
          schema={StretcherSummarySchema}
          scroll={{ y: 280 }}
        />
      </div>
    </>
  )
}
