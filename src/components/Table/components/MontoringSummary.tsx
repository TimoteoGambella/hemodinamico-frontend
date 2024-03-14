/* eslint-disable @typescript-eslint/no-explicit-any */
import { Table, TableColumnsType, Typography } from 'antd'

interface MontoringProps {
  scroll?: { y?: number; x?: number }
  schema: TableColumnsType<any>
  isLoading?: boolean
  source: any[]
}

const MontoringSummary = ({ schema, source, isLoading }: MontoringProps) => {
  const loading = isLoading || false

  return (
    <>
      <Typography.Title level={3} style={{ margin: '0 !important' }}>
        Resumen de monitoreo
      </Typography.Title>
      <Table
        columns={schema}
        dataSource={source}
        loading={loading}
        bordered
        size="middle"
        className="tbl-td-center transition-w-ease-out"
        scroll={{ y: 280 }}
      />
    </>
  )
}

export default MontoringSummary
