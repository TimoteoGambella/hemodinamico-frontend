import { Empty, Flex, Space, Typography } from 'antd'
import { MessageInstance } from 'antd/es/message/interface'
import { useState, useEffect } from 'react'
import FloatBtn from '../FloatBtn'
import CustomForm from '../Form'

interface MainContentProps {
  msgApi: MessageInstance
  data: LaboratoryData
}

const LabContent = ({ data, msgApi }: MainContentProps) => {
  const { editedAt, createdAt } = data
  const { patientId: patientInfo } = data
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
    if (labInfo?._id === data._id) return
    setLabInfo(data)
  }, [labInfo, data])

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

  if (typeof patientInfo === 'string') return <Empty description="Sin datos" />
  return (
    <>
      <div className="form-lab-header">
        <Typography.Title className='title' level={2}>EXÁMEN DE LABORATORIO</Typography.Title>
        <Typography.Text className='text'>
          {data.editedAt ? 'Última vez editado: ' : 'Creado el: '}
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
