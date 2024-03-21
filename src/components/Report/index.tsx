import StretcherReportSchema from '../Table/constants/StretcherReportSchema'
import columnSearchGenerator from './controller/columnSearchGenerator'
import { fetchReportLabs, fetchReportStretchers } from './controller'
import getLabReportSchema from '../Table/constants/LabReportSchema'
import { Flex, InputRef, Space, Typography } from 'antd'
import { useEffect, useRef, useState } from 'react'
import useMsgApi from '../../hooks/useMsgApi'
import CustomTable from '../Table'

export interface LabReportType extends LaboratoryData {
  children: (LabVersions & { key: React.Key })[]
}
export interface StretcherReportType extends StretcherData {
  children: (StretcherData & { key: React.Key })[]
}

export default function Database() {
  const [LabReportSchema, setLabRSchema] = useState<TableSchema<unknown>[]>([])
  const [stretcherReport, setStretcherR] = useState<StretcherReportType[]>()
  const [labsResport, setLabsR] = useState<LabReportType[]>()
  const msgApi = useMsgApi()

  const searchTextRef = useRef('')
  const searchedColumnRef = useRef('')
  const searchInput = useRef<InputRef>(null)

  const getColumnSearchProps = columnSearchGenerator({
    searchTextRef,
    searchedColumnRef,
    searchInput,
  })

  useEffect(() => {
    if (labsResport) return
    fetchReportLabs({ msgApi, setter: setLabsR })
  }, [labsResport, msgApi])

  useEffect(() => {
    if (stretcherReport) return
    fetchReportStretchers({ msgApi, setter: setStretcherR })
  }, [stretcherReport, msgApi])

  useEffect(() => {
    if (!stretcherReport) return
    if (LabReportSchema.length > 1) return
    /**
     * ESTA PORCION DE CODIGO ES PARA APLICAR EL FILTRO DE BUSQUEDA EN LA TABLA
     */
    const schema = getLabReportSchema(stretcherReport)

    const index = schema.findIndex((item) => item.title === 'PACIENTE')
    if (index !== -1 && Array.isArray(schema[index].children)) {
      const index1 = schema[index].children!.findIndex(
        (item) => item.title === 'Nombre completo'
      )
      if (index1 !== -1) {
        schema[index].children![index1] = {
          ...schema[index].children![index1],
          ...getColumnSearchProps('patientId.fullname'),
        }
      }
    }

    setLabRSchema(schema as unknown as TableSchema<unknown>[])
  }, [LabReportSchema.length, getColumnSearchProps, stretcherReport])

  return (
    <>
      <Typography.Title level={2}>Base de Datos General</Typography.Title>
      <Typography.Text>
        En esta sección se muestran los datos generales de los registros.
      </Typography.Text>
      <Flex gap={8} vertical>
        <Space direction="vertical" size="large">
          <CustomTable.Default
            printeable={true}
            schemaType="lab"
            title="Laboratorios"
            schema={LabReportSchema}
            source={labsResport}
          />
        </Space>
        <Space direction="vertical" size="large">
          <CustomTable.Default
            title="Camas"
            printeable={true}
            schemaType="stretcher"
            schema={StretcherReportSchema}
            source={stretcherReport}
          />
        </Space>
      </Flex>
    </>
  )
}
