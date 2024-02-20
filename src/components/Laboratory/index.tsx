import { MessageInstance } from 'antd/es/message/interface'
import {
  Empty,
  Flex,
  Spin,
  Typography,
  Space,
  Button,
} from 'antd'
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
      .then((res) => {
        console.log(res)
        setLabData(res)
      })
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
        <MainContent labInfo={labData} msgApi={msgApi} />
      ) : (
        <Empty />
      )}
    </Spin>
  )
}

interface MainContentProps {
  msgApi: MessageInstance
  labInfo: LaboratoryData
}

const MainContent = ({ labInfo }: MainContentProps) => {
  const [formProp, setFormProp] = useState<FormPropType>({
    enable: false,
    message: null,
    status: 'initial',
    shouldSubmit: false,
    setFormProp: undefined,
  })
  const { patientId: patientInfo } = labInfo

  const handleEnableEdit = () => {
    setFormProp({ ...formProp, shouldSubmit: false, setFormProp, enable: !formProp.enable})
  }

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
        id='edit-lab-forms'
      ></Button>
      <Flex justify='center' gap={10} wrap='wrap'>
        <Space className="patient-container">
          <div className="patient-header">
            <Typography.Title level={4}>
              Información del paciente
            </Typography.Title>
          </div>
          <CustomForm.LabPatient formProp={formProp} data={patientInfo}></CustomForm.LabPatient>
        </Space>

        <Space className="patient-container">
          <div className="patient-header">
            <Typography.Title level={4}>
              Hematología y Coagulación
            </Typography.Title>
          </div>
          <CustomForm.LabHema formProp={formProp} data={labInfo.hematology} ></CustomForm.LabHema>
        </Space>

        <Space className="patient-container">
          <div className="patient-header">
            <Typography.Title level={4}>
              Perfil  hepático
            </Typography.Title>
          </div>
          <CustomForm.LabLiver formProp={formProp} data={labInfo.liver_profile} ></CustomForm.LabLiver>
        </Space>

        <Space className="patient-container">
          <div className="patient-header">
            <Typography.Title level={4}>
              Infeccioso e inflamatorio
            </Typography.Title>
          </div>
          <CustomForm.LabInfec formProp={formProp} data={labInfo.infective} ></CustomForm.LabInfec>
        </Space>

        <Space className="patient-container">
          <div className="patient-header">
            <Typography.Title level={4}>
              Perfil  cardiaco
            </Typography.Title>
          </div>
          <CustomForm.LabCardiac formProp={formProp} data={labInfo.cardiac_profile} ></CustomForm.LabCardiac>
        </Space>
        
        <Space className="patient-container">
          <div className="patient-header">
            <Typography.Title level={4}>
              Información renal
            </Typography.Title>
          </div>
          <CustomForm.LabKidney formProp={formProp} data={labInfo.kidney} ></CustomForm.LabKidney>
        </Space>
      </Flex>
    </>
  )
}

export default Laboratory
