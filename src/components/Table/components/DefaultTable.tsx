/* eslint-disable @typescript-eslint/no-explicit-any */
import { CloudDownloadOutlined, DownOutlined } from '@ant-design/icons'
import routeSchema from '../../App/constants/routeSchema'
import useStretchers from '../../../hooks/useStretchers'
import useCollapsed from '../../../hooks/useCollapsed'
import { useEffect, useRef, useState } from 'react'
import exportToPDF from '../controller/exportToPDF'
import * as Ant from 'antd'

type SourceType = {
  [k: string]: any
  children?: Array<{
    [k: string]: any
    key: React.Key
  }>
}

interface DefaultTableProps {
  scroll?: { y?: number; x?: number }
  schema: Ant.TableColumnsType<any>
  source?: SourceType[]
  printeable?: boolean
  title?: string
}
export default function DefaultTable(props: DefaultTableProps) {
  const { schema, source, scroll, title, printeable } = props
  const [sourceWithKeys, setSource] = useState<SourceType['children'] | null>(
    null
  )
  const [selected, setSelected] = useState<string | undefined>()
  const [isExpanded, setIsExpanded] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isOpen, setIsOpen] = useState(false)
  const defaultScroll = scroll || { y: 280 }
  const selectRef = useRef<any>(null)
  const isCollapsed = useCollapsed()
  const stretchers = useStretchers()
  const [form] = Ant.Form.useForm()

  const validateChildrens = (source: Record<string, unknown>[]) => {
    return source.some((item) => {
      if (Array.isArray(item.children)) {
        return item.children.some((child) => child.key === undefined)
      }
      return false
    })
  }

  const handleOk = () => {
    form.validateFields().then(() => {
      const val = selected?.split(' [')[2]
      const id = val?.replace(']', '')
      form.resetFields()
      const body = source?.find((item) => item._id === id) as any
      exportToPDF(body, schema as TableSchema<unknown>[], stretchers!)
      setIsOpen(false)
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
      if (window.location.pathname !== routeSchema.report.path) {
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

  const suffix = (
    <>
      <span>
        {selected ? 1 : 0} / {1}
      </span>
      <DownOutlined />
    </>
  )

  return (
    <>
      {title && (
        <div style={{ position: 'relative' }}>
          <Ant.Typography.Title level={3} style={{ margin: '0 !important' }}>
            {title}
          </Ant.Typography.Title>
          {printeable && (
            <Ant.Tooltip title="Descargar reporte" placement="right">
              <Ant.Button
                style={{ position: 'absolute', top: '3px' }}
                type="primary"
                onClick={() => setIsOpen(true)}
                icon={<CloudDownloadOutlined />}
              />
            </Ant.Tooltip>
          )}
        </div>
      )}
      <Ant.Modal
        open={isOpen}
        onOk={handleOk}
        onCancel={() => setIsOpen(false)}
      >
        <Ant.Typography.Title level={4}>
          Exportar Reporte de Paciente
        </Ant.Typography.Title>
        {source && (
          <Ant.Form form={form}>
            <Ant.Form.Item
              label="Paciente"
              name="patient"
              rules={[
                {
                  required: true,
                  message: 'Elige un paciente',
                },
              ]}
            >
              <Ant.Select
                ref={selectRef}
                mode="multiple"
                value={selected ? [selected] : []}
                suffixIcon={suffix}
                maxCount={1}
                onChange={(value: string[]) => {
                  setSelected(value[0] as string)
                  selectRef.current?.blur()
                }}
                options={source.map((item) => ({
                  value:
                    item.patientId.fullname +
                    ` [${item.patientId.dni}]` +
                    ` [${item._id}]`,
                  label: item.patientId.fullname + ` [${item.patientId.dni}]`,
                }))}
              />
            </Ant.Form.Item>
          </Ant.Form>
        )}
      </Ant.Modal>
      <Ant.Table
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
