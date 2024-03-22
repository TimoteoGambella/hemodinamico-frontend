/* eslint-disable @typescript-eslint/no-explicit-any */
import { CloudDownloadOutlined, DownOutlined } from '@ant-design/icons'
import { useCallback, useEffect, useRef, useState } from 'react'
import * as ctlr from '../controller/defaultTable.controller'
import routeSchema from '../../App/constants/routeSchema'
import useCollapsed from '../../../hooks/useCollapsed'
import useMsgApi from '../../../hooks/useMsgApi'
import * as Ant from 'antd'

interface DefaultTableProps {
  scroll?: { y?: number; x?: number }
  schema: TableSchema<any>[]
  source?: DefaultTableSourceType[]
  printeable?: boolean
  schemaType?: 'lab' | 'stretcher'
  title?: string
}
export default function DefaultTable(props: DefaultTableProps) {
  const { schema, source, scroll, title, printeable, schemaType } = props
  const [allStretchers, setStretchers] = useState<StretcherData[] | undefined>()
  const [sourceWithKeys, setSource] = useState<
    DefaultTableSourceType['children'] | null
  >(null)
  const [selected, setSelected] = useState<string | undefined>()
  const [isExpanded, setIsExpanded] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isOpen, setIsOpen] = useState(false)
  const defaultScroll = scroll || { y: 280 }
  const selectRef = useRef<any>(null)
  const isCollapsed = useCollapsed()
  const [form] = Ant.Form.useForm()
  const msgApi = useMsgApi()

  if (printeable && !schemaType) {
    throw new Error('The schemaType prop is required when printeable is true')
  }

  const validateChildrens = (source: Record<string, unknown>[]) => {
    return source.some((item) => {
      if (Array.isArray(item.children)) {
        return item.children.some((child) => child.key === undefined)
      }
      return false
    })
  }

  const handleOk = () => {
    if (!allStretchers) {
      msgApi.error(
        'Sin la información de las camas no es posible realizar esta acción.'
      )
      return
    }

    form.validateFields().then(() => {
      const val = selected?.split(' [')[2]
      const id = val?.replace(']', '')
      const body = source?.find((item) => item._id === id)
      const status = ctlr.schemaToPDF({
        body: body!,
        schema,
        stretchers: allStretchers,
        schemaType: schemaType!,
      })

      if (status) {
        setIsOpen(false)
        form.resetFields()
        msgApi.success('Reporte generado con éxito.')
      } else {
        msgApi.error('Error al generar el reporte. Intente de nuevo.')
      }
    })
  }
  const handleExportDB = () => {
    if (!allStretchers) {
      msgApi.error(
        'Sin la información de las camas no es posible realizar esta acción.'
      )
      return
    }

    ctlr
      .schemaToExcel({
        body: source!,
        schema,
        stretchers: allStretchers,
        schemaType: schemaType!,
      })
      .then((status) => {
        if (status) {
          msgApi.success('BD general exportado con éxito.')
        } else {
          msgApi.error('Error al generar el excel. Intente de nuevo.')
        }
      })
  }

  const handleWindowChange = useCallback(() => {
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
      main.style.width = `calc(100dvw - ${
        isExpanded ? width + 20 : width + 20
      }px)`
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
    handleWindowChange()
  }, [handleWindowChange])

  useEffect(() => {
    if (!source) return
    const shouldReject = validateChildrens(source)
    if (shouldReject)
      throw new Error('All items in children must have a key property')
    setSource(source.map((item, index) => ({ ...item, key: index })))
  }, [source])

  useEffect(() => {
    if (printeable && schemaType) {
      const fetchStretchers = async () => {
        const stretchers = await ctlr.getAllStretchers()
        if (!stretchers) {
          msgApi.error('Error al obtener las camas. Intente de nuevo.')
          return
        }
        setStretchers(stretchers)
      }
      fetchStretchers()
    }
  }, [printeable, schemaType, msgApi])

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
                disabled={isLoading}
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
            <Ant.Form.Item label="Exportar Base de Datos">
              <Ant.Button
                type="primary"
                icon={<CloudDownloadOutlined />}
                onClick={handleExportDB}
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
