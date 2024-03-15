import SummarySchema from '../../Table/constants/LabSummarySchema'
import { useEffect, useState } from 'react'
import CustomTable from '../../Table'

type LabDataWithKey = LaboratoryData & { key: React.Key }
interface LabSummaryProps {
  versions: LaboratoryData[] | null
  currentTab: TabsKeys
}

export default function LabSummary({ versions, currentTab }: LabSummaryProps) {
  const [data, setData] = useState<LabDataWithKey[] | null>(null)
  const [patientId, setPatientId] = useState<string | null>(null)
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
    if (data) {
      const patientId = data[0].patientId
      if (typeof patientId === 'string') setPatientId(patientId)
      setIsLoading(false)
    }
  }, [data])

  return (
    <>
      <div style={{ marginBottom: '1.5rem' }}>
        <CustomTable.User patientId={patientId} />
      </div>
      <div>
        <CustomTable.Monitoring
          currentTab={currentTab}
          schema={SummarySchema}
          isLoading={isLoading}
          source={data as []}
          scroll={{ y: 280 }}
        />
      </div>
    </>
  )
}
