import { Space, Modal } from "antd"
import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import useMsgApi from "../../../hooks/useMsgApi"
import usePatients from "../../../hooks/usePatients"
import CustomForm from "../../Form"

interface ActionRenderProps {
  data: PatientData["_id"]
  setShouldGetUsers: React.Dispatch<React.SetStateAction<boolean>>
}

const ActionRender = ({ data, setShouldGetUsers }: ActionRenderProps) => {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const patient = usePatients().find((p) => p._id === data)
  const [formProp, setFormProp] = useState<FormPropType>({
    shouldSubmit: false,
    message: null,
    status: 'initial',
    setFormProp: undefined,
    enable: true,
  })
  const msgApi = useMsgApi()

  const handleOk = () => {
    setFormProp({ ...formProp, shouldSubmit: true, setFormProp })
  }

  useEffect(() => {
    if (formProp.shouldSubmit) return

    if (formProp.status === 'ok') {
      setIsLoading(false)
      setShouldGetUsers(true)
      setOpen(false)
      setFormProp({ ...formProp, status: 'initial', message: null })
    } else if (formProp.status === 'loading') {
      setIsLoading(true)
    }
  }, [formProp, msgApi, setShouldGetUsers])
 

  if (!patient) return null

  return (
    <Space size="middle">
      <a onClick={() => setOpen(true)}>Editar</a>
      {patient.laboratoryId ? (
        <Link to={`/laboratorio/${patient.laboratoryId}`}>
          Ver laboratorio
        </Link>
      ) : (
        <a onClick={() => console.log('click')}>Asignar laboratorio</a>
      )}
      <Modal
        title="Editar paciente"
        open={open}
        onOk={handleOk}
        confirmLoading={isLoading}
        onCancel={() => setOpen(false)}
      >
        {patient && <CustomForm.EditPatient formProp={formProp} data={patient} />}
      </Modal>
    </Space>
  )
}

export default ActionRender
