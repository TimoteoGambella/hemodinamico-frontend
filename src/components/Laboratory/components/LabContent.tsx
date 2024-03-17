import { MessageInstance } from 'antd/es/message/interface'
import { Empty, Flex, Space, Typography } from 'antd'
import { useState, useEffect } from 'react'
import FloatBtn from '../../FloatBtn'
import CustomForm from '../../Form'
import usePatients from '../../../hooks/usePatients'

interface MainContentProps {
  msgApi: MessageInstance
  data: LaboratoryData
}

const LabContent = ({ data, msgApi }: MainContentProps) => {
  const lab = JSON.parse(JSON.stringify(data)) as LaboratoryData
  const { editedAt, createdAt } = lab
  const patients = usePatients()
  const [patientInfo, setPatientInfo] = useState<PatientData | null>(null)
  const editedBy = new Date(editedAt ? editedAt : createdAt).toLocaleString()
  const [labInfo, setLabInfo] = useState<LaboratoryData | null>(null)
  const [formProp, setFormProp] = useState<FormPropType>({
    enable: false,
    message: null,
    status: 'initial',
    shouldSubmit: false,
    setFormProp: undefined,
  })

  const handleEnableEdit = () => {
    setFormProp({
      ...formProp,
      shouldSubmit: false,
      setFormProp,
      enable: !formProp.enable,
    })
  }

  useEffect(() => {
    if (labInfo?._id === lab._id) return
    const getCurrentPatient = async () => {
      const res = patients.find((p) => p._id === lab.patientId._id)
      if (!res) {
        msgApi.error('Error al obtener información del paciente.')
        return
      } else {
        lab.patientId = res
        setLabInfo(lab)
      }
    }
    getCurrentPatient()
  }, [labInfo, lab, msgApi, patients])

  useEffect(() => {
    if (!labInfo) return
    setPatientInfo(labInfo.patientId)
  }, [labInfo])

  useEffect(() => {
    if (formProp.shouldSubmit) return
    if (formProp.status === 'initial') return
    if (formProp.status === 'loading') return

    if (formProp.status === 'ok') {
      setFormProp({
        ...formProp,
        status: 'initial',
        message: null,
        enable: false,
      })
    } else if (formProp.status === 'form-error') {
      msgApi.warning(formProp.message)
      setFormProp({ ...formProp, status: 'initial', message: null })
    } else if (formProp.status === 'server-error') {
      msgApi.error(formProp.message)
      setFormProp({ ...formProp, status: 'initial', message: null })
    }
  }, [formProp, msgApi])

  if (!patientInfo) return <Empty description="Sin datos" />
  return (
    <>
      <div className="form-lab-header">
        <Typography.Title className='title' level={2}>EXÁMEN DE LABORATORIO</Typography.Title>
        <Typography.Text className='text'>
          {lab.editedAt ? 'Última vez editado: ' : 'Creado el: '}
          {editedBy}
        </Typography.Text>
      </div>
      <FloatBtn.Options onEditClick={handleEnableEdit} deleteType="lab" />
      <FloatBtn.ToTop />
      <Flex justify="center" gap={10} wrap="wrap">
        <Space className="form-space-content">
          <CustomForm.Laboratory
            formProp={formProp}
            data={labInfo!}
          ></CustomForm.Laboratory>
        </Space>
      </Flex>
    </>
  )
}

export default LabContent
