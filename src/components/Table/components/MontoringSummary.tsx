/* eslint-disable @typescript-eslint/no-explicit-any */
import { Table, TableColumnsType, Typography } from 'antd'
import useCollapsed from '../../../hooks/useCollapsed'
import { useEffect } from 'react'

interface MontoringProps {
  scroll?: { y?: number; x?: number }
  schema: TableColumnsType<any>
  currentTab: TabsKeys
  isLoading?: boolean
  source: any[]
}

const MontoringSummary = (props: MontoringProps) => {
  const { schema, source, isLoading, scroll, currentTab } = props
  const loading = isLoading || false
  const isCollapsed = useCollapsed()

  useEffect(() => {
    const main = document.querySelector('main')!
    if (currentTab === 'summary') {
      main.classList.add(...['transition-w-ease-out', 'min-w-680'])
      main.style.width = `calc(100dvw - ${isCollapsed ? 80 : 200}px)`
    } else {
      main.classList.remove(...['transition-w-ease-out', 'min-w-680'])
      main.style.width = ''
    }
  }, [currentTab, isCollapsed])

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
        scroll={scroll}
      />
    </>
  )
}

export default MontoringSummary
