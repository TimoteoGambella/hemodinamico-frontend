import AxiosController from '../../../utils/axios.controller'
import SummarySchema from '../constants/SummarySchema'
import { useEffect, useState } from 'react'
import { AxiosError } from 'axios'
import { Table } from 'antd'

const axios = new AxiosController()

type LabDataWithKey = LaboratoryData & { key: React.Key }

export default function LabSummary({ id }: { id: string }) {
  const [data, setData] = useState<LabDataWithKey[] | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    axios.getLabListVersion(id, true).then((res) => {
      if (res instanceof AxiosError) {
        console.error(res)
        return
      } else {
        const val = (res.data.data as LaboratoryData[]).map((lab, index) => ({
          ...lab,
          key: index,
        }))
        setData(val)
      }
    })
  }, [id])

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
