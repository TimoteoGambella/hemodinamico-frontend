/* eslint-disable @typescript-eslint/no-explicit-any */
import { TableColumnsType, Typography, Table } from 'antd'
import useCollapsed from '../../../hooks/useCollapsed'
import { useEffect, useState } from 'react'
import routeSchema from '../../App/constants/routeSchema'

type SourceType = {
  [k: string]: any
  children?: Array<{
    [k: string]: any
    key: React.Key
  }>
}

interface DefaultTableProps {
  scroll?: { y?: number; x?: number }
  schema: TableColumnsType<any>
  source?: SourceType[]
  title?: string
}
export default function DefaultTable(props: DefaultTableProps) {
  const { schema, source, scroll, title } = props
  const [sourceWithKeys, setSource] = useState<SourceType['children'] | null>(
    null
  )
  const [isLoading, setIsLoading] = useState(true)
  const [isExpanded, setIsExpanded] = useState(false)
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
    const width = isCollapsed ? 80 : 200
    const innerHeight = window.innerHeight
    const main = document.querySelector('main')!
    const clientHeight = main.clientHeight
    main.classList.add(...['transition-w-ease-out', 'min-w-680'])
    /**
     * Las tablas pueden hacer que el contenedor sea más grande que el
     * alto de la ventana, por lo que se debe hacer un ajuste en el ancho
     * de la tabla para que no se muestre el scroll horizontal
     */
    if (innerHeight < clientHeight) {
      main.style.width = `calc(100dvw - ${isExpanded ? width + 20 : width}px)`
    } else {
      main.style.width = `calc(100dvw - ${width}px)`
    }

    //Elimina el estilo al desmontar el componente
    return () => {
      //Si no es la ruta de reporte, se elimina el estilo
      if (window.location.pathname !== routeSchema.report.path){
        main.style.width = ''
      }
    }
  }, [isCollapsed, isExpanded])

  useEffect(() => {
    if (!source) return
    const shouldReject = validateChildrens(source)
    if (shouldReject)
      throw new Error('All items in children must have a key property')
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
        expandable={{
          onExpand: (expanded) => setIsExpanded(expanded),
        }}
      />
    </>
  )
}
