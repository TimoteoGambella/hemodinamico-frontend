import StretcherReportSchema from '../Table/constants/StretcherReportSchema'
import LabReportSchema from '../Table/constants/LabReportSchema'
import { fetchReportLabs, fetchReportStretchers } from './controller'
import { Flex, Space, Typography } from 'antd'
import useMsgApi from '../../hooks/useMsgApi'
import { useEffect, useState } from 'react'
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
