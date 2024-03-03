import { Empty, Flex, Space, Typography } from "antd"
import { MessageInstance } from "antd/es/message/interface"
import { useState, useEffect } from "react"
import FormFloatButton from "../FloatButton"
import CustomForm from "../Form"

interface MainContentProps {
  msgApi: MessageInstance
  data: LaboratoryData
}

const LabContent = ({ data, msgApi }: MainContentProps) => {
  const { patientId: patientInfo } = data
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
    setLabInfo({
      ...data,
      infective: {
        ...data.infective,
        resultado: data.infective.resultado ? 'true' : 'false',
      },
    })
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
      <Typography.Title level={2}>EXÁMEN DE LABORATORIO</Typography.Title>
      <FormFloatButton onEditClick={handleEnableEdit} />
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
