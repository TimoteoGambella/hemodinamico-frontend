import SummarySchema from '../constants/SummarySchema'
import { useEffect, useState } from 'react'
import { Table } from 'antd'


type LabDataWithKey = LaboratoryData & { key: React.Key }

interface LabSummaryProps {
  versions: LaboratoryData[] | null
}

export default function LabSummary({ versions }: LabSummaryProps) {
  const [data, setData] = useState<LabDataWithKey[] | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!versions) return
    const val = versions
      .map((lab, index) => ({
        ...lab,
        key: index,
      }))
    setData(val)
  }, [versions])

  useEffect(() => {
    if (data) setIsLoading(false)
  }, [data])

  return (
    <Table
      columns={SummarySchema}
      dataSource={data as LabDataWithKey[]}
      loading={isLoading}
      bordered
      size="middle"
      className="tbl-td-center transition-w-ease-out"
      scroll={{ y: 280 }}
    />
  )
}
