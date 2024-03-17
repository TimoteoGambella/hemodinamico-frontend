import LabSummarySchema from '../../Table/constants/LabSummarySchema'
import { useEffect, useState } from 'react'
import CustomTable from '../../Table'

type LabDataWithKey = LaboratoryData & { key: React.Key }
interface LabSummaryProps {
  versions: LaboratoryData[] | null
  currentTab: TabsKeys
  patientId: string
}

export default function LabSummary({ versions, currentTab, patientId }: LabSummaryProps) {
  const [data, setData] = useState<LabDataWithKey[] | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!versions) return
    const val = versions.map((lab, index) => ({
      ...lab,
      key: index,
    }))
    setData(val)
  }, [versions])

  useEffect(() => {
    if (!data || data.length === 0) {
      setIsLoading(false)
      return
    }
    setIsLoading(false)
  }, [data])

  return (
    <>
      <div style={{ marginBottom: '1.5rem' }}>
        <CustomTable.User patientId={patientId} />
      </div>
      <div>
        <CustomTable.Monitoring
          currentTab={currentTab}
          schema={LabSummarySchema}
          isLoading={isLoading}
          source={data as []}
          scroll={{ y: 280 }}
        />
      </div>
    </>
  )
}
