import { MessageInstance } from 'antd/es/message/interface'
import { Empty, Flex, Spin, Typography, Space, Button } from 'antd'
import { loadLabData } from './controller'
import { useParams } from 'react-router-dom'
import { EditOutlined } from '@ant-design/icons'
import useMsgApi from '../../hooks/useMsgApi'
import { useEffect, useState } from 'react'
import CustomForm from '../Form'
import './style.css'

interface LaboratoryProps {}

// eslint-disable-next-line no-empty-pattern
const Laboratory = ({}: LaboratoryProps) => {
  const { id } = useParams()
  const msgApi = useMsgApi()
  const [isLoading, setIsLoading] = useState(true)
  const [shouldRender, setShouldRender] = useState(true)
  const [labData, setLabData] = useState<LaboratoryData | null>(null)

  useEffect(() => {
    if (!id) return
    loadLabData({ id, msgApi })
      .then((res) => setLabData(res))
      .catch((err) => {
        console.error(err)
        setShouldRender(false)
      })
      .finally(() => setIsLoading(false))
  }, [msgApi, id])

  useEffect(() => {
    setIsLoading(true)
    setShouldRender(true)
  }, [id])

  return (
    <Spin spinning={isLoading}>
      {shouldRender && labData ? (
        <MainContent data={labData} msgApi={msgApi} />
      ) : (
        <Empty />
      )}
    </Spin>
  )
}

interface MainContentProps {
  msgApi: MessageInstance
  data: LaboratoryData
}

const MainContent = ({ data }: MainContentProps) => {
  const [formProp, setFormProp] = useState<FormPropType>({
    enable: false,
    message: null,
    status: 'initial',
    shouldSubmit: false,
    setFormProp: undefined,
  })
  const [labInfo, setLabInfo] = useState<LaboratoryData | null>(null)
  const { patientId: patientInfo } = data

  const handleEnableEdit = () => {
    setFormProp({
      ...formProp,
      shouldSubmit: false,
      setFormProp,
      enable: !formProp.enable,
    })
  }

  useEffect(() => {
    if(labInfo) return
    setLabInfo({
      ...data,
      infective: {
        ...data.infective,
        resultado: data.infective.resultado ? 'true' : 'false',
      },
    })
  }, [labInfo, data])

  if (typeof patientInfo === 'string') return <Empty />
  return (
    <>
      <Typography.Title level={2}>EXÁMEN DE LABORATORIO</Typography.Title>
      <Button
        type="primary"
        shape="round"
        size="large"
        onClick={handleEnableEdit}
        icon={<EditOutlined />}
        id="edit-lab-forms"
      ></Button>
      <Flex justify="center" gap={10} wrap="wrap">
        <Space className="patient-container">
          <CustomForm.Laboratory
            formProp={formProp}
            data={labInfo!}
          ></CustomForm.Laboratory>
        </Space>
      </Flex>
    </>
  )
}

export default Laboratory
