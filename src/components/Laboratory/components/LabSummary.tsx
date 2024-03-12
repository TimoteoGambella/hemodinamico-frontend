import SummarySchema from '../../Table/constants/SummarySchema'
import { useEffect, useState } from 'react'
import { Table, Typography } from 'antd'
import CustomTable from '../../Table'

type LabDataWithKey = LaboratoryData & { key: React.Key }
interface LabSummaryProps {
  versions: LaboratoryData[] | null
}

export default function LabSummary({ versions }: LabSummaryProps) {
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
      setPatientId((data[0].patientId as PatientData)._id)
      setIsLoading(false)
    }
  }, [data])

  return (
    <>
      <div style={{ marginBottom: '1.5rem' }}>
        <CustomTable.User patientId={patientId} />
      </div>
      <div>
        <Typography.Title level={3} style={{ margin: '0 !important' }}>
          Resumen de monitoreo
        </Typography.Title>
        <Table
          columns={SummarySchema}
          dataSource={data as LabDataWithKey[]}
          loading={isLoading}
          bordered
          size="middle"
          className="tbl-td-center transition-w-ease-out"
          scroll={{ y: 280 }}
        />
      </div>
    </>
  )
}
