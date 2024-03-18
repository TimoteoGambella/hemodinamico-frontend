import StretcherReportSchema from '../Table/constants/StretcherReportSchema'
import columnSearchGenerator from './controller/columnSearchGenerator'
import { fetchReportLabs, fetchReportStretchers } from './controller'
import LabReportSchema from '../Table/constants/LabReportSchema'
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
  const [stretcherReport, setLabsS] = useState<StretcherReportType[]>()
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

  const index = LabReportSchema.findIndex((item) => item.title === 'PACIENTE')
  if (index !== -1 && Array.isArray(LabReportSchema[index].children)) {
    const index1 = LabReportSchema[index].children!.findIndex(
      (item) => item.title === 'Nombre completo'
    )
    if (index1 !== -1) {
      LabReportSchema[index].children![index1] = {
        ...LabReportSchema[index].children![index1],
        ...getColumnSearchProps('patientId.fullname'),
      }
    }
  }

  useEffect(() => {
    if (labsResport) return
    fetchReportLabs({ msgApi, setter: setLabsR })
  }, [labsResport, msgApi])

  useEffect(() => {
    if (stretcherReport) return
    fetchReportStretchers({ msgApi, setter: setLabsS })
  }, [stretcherReport, msgApi])

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
            title="Laboratorios"
            schema={LabReportSchema}
            source={labsResport}
          />
        </Space>
        <Space direction="vertical" size="large">
          <CustomTable.Default
            title="Camas"
            schema={StretcherReportSchema}
            source={stretcherReport}
          />
        </Space>
      </Flex>
    </>
  )
}
