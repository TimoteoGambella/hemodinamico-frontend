import StretcherSummarySchema from '../Table/constants/StretcherSummarySchema'
import LabReportSchema from '../Table/constants/LabReportSchema'
import { fetchReportLabs } from './controller'
import { Flex, Space, Typography } from 'antd'
import useMsgApi from '../../hooks/useMsgApi'
import { useEffect, useState } from 'react'
import useLabs from '../../hooks/useLabs'
import CustomTable from '../Table'

export interface LabReportType extends LaboratoryData {
  children: (LabVersions & { key: React.Key })[]
}


export default function Database() {
  const [labsResport, setLabsR] = useState<LabReportType[]>()
  const labs = useLabs() as unknown as Record<string, unknown>[]
  const msgApi = useMsgApi()

  useEffect(() => {
    if (!labs || labsResport) return
    fetchReportLabs({ msgApi, setter: setLabsR })
  }, [labs, labsResport, msgApi])

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
            schema={StretcherSummarySchema}
            source={[]}
          />
        </Space>
      </Flex>
    </>
  )
}
