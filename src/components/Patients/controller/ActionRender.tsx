import { Space, Modal } from 'antd'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import useMsgApi from '../../../hooks/useMsgApi'
import usePatients from '../../../hooks/usePatients'
import CustomForm from '../../Form'

interface ActionRenderProps {
  data: PatientData['_id']
  setShouldGetUsers: React.Dispatch<React.SetStateAction<boolean>>
}

const ActionRender = ({ data, setShouldGetUsers }: ActionRenderProps) => {
  const [IsOpen, setIsOpen] = useState(false)
  const [isCancel, setIsCancel] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isDisabled, setIsDisabled] = useState(true)
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
      setIsOpen(false)
      setFormProp({ ...formProp, status: 'initial', message: null })
    } else if (formProp.status === 'loading') {
      setIsLoading(true)
    }
  }, [formProp, msgApi, setShouldGetUsers])

  if (!patient) return null

  return (
    <Space size="middle">
      <a onClick={() => setIsOpen(true)}>Editar</a>
      {patient.laboratoryId ? (
        <Link to={`/laboratorio/${patient.laboratoryId}`}>Ver laboratorio</Link>
      ) : (
        <a onClick={() => console.log('click')}>Asignar laboratorio</a>
      )}
      <Modal
        title="Editar paciente"
        open={IsOpen}
        onOk={handleOk}
        confirmLoading={isLoading}
        onCancel={() => {
          setIsCancel(true)
          setIsOpen(false)
        }}
        okButtonProps={{ disabled: isDisabled }}
      >
        {patient && (
          <CustomForm.EditPatient
            formProp={formProp}
            data={patient}
            onFieldsChange={() => setIsDisabled(false)}
            onCancel={
              isCancel
                ? () => {
                    setIsCancel(false)
                    setIsDisabled(true)
                  }
                : undefined
            }
          />
        )}
      </Modal>
    </Space>
  )
}

export default ActionRender
