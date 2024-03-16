/* eslint-disable @typescript-eslint/no-explicit-any */
import { TableColumnsType, Typography, Table } from 'antd'
import useCollapsed from '../../../hooks/useCollapsed'
import { useEffect, useState } from 'react'

type SourceType = {
  [k: string]: any;
  children?: Array<{
    [k: string]: any;
    key: React.Key;
  }>;
}

interface DefaultTableProps {
  scroll?: { y?: number; x?: number }
  schema: TableColumnsType<any>
  source?: SourceType[]
  title?: string
}
export default function DefaultTable(props: DefaultTableProps) {
  const { schema, source, scroll, title } = props
  const [sourceWithKeys, setSource] = useState<SourceType['children'] | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const defaultScroll = scroll || { y: 280 }
  const isCollapsed = useCollapsed()

  const validateChildrens = (source: Record<string, unknown>[]) => {
    return source.some((item) => {
      if (Array.isArray(item.children)) {
      return item.children.some((child) => child.key === undefined)
      }
      return false
    })
  }

  useEffect(() => {
    const main = document.querySelector('main')!
    main.classList.add(...['transition-w-ease-out', 'min-w-680'])
    main.style.width = `calc(100dvw - ${isCollapsed ? 80 : 200}px)`
  }, [isCollapsed])

  useEffect(() => {
    if (!source) return
    const shouldReject = validateChildrens(source)
    if (shouldReject) throw new Error('All items in children must have a key property')
    setSource(source.map((item, index) => ({ ...item, key: index })))
  }, [source])

  useEffect(() => {
    if (sourceWithKeys) setIsLoading(false)
  }, [sourceWithKeys])

  return (
    <>
      {title && (
        <Typography.Title level={3} style={{ margin: '0 !important' }}>
          {title}
        </Typography.Title>
      )}
      <Table
        columns={schema}
        dataSource={sourceWithKeys as []}
        loading={isLoading}
        bordered
        size="middle"
        className="tbl-td-center transition-w-ease-out"
        scroll={defaultScroll}
      />
    </>
  )
}
