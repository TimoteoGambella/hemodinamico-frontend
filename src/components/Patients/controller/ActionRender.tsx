import { LaboratoryDataContext } from '../../../contexts/LaboratoryDataProvider'
import { StretcherDataContext } from '../../../contexts/StretcherDataProvider'
import { PatientDataContext } from '../../../contexts/PatientDataProvider'
import { useState, useEffect, useContext } from 'react'
import usePatients from '../../../hooks/usePatients'
import useMsgApi from '../../../hooks/useMsgApi'
import { Link } from 'react-router-dom'
import { Space, Modal } from 'antd'
import { handleAssignLab } from '.'
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
  const [shouldUpdate, setShouldUpdate] = useState(false)
  const { updateLabs } = useContext(LaboratoryDataContext)
  const { updatePatients } = useContext(PatientDataContext)
  const { updateStretchers } = useContext(StretcherDataContext)
  const patient = usePatients().find((p) => p._id === data)
  const [formProp, setFormProp] = useState<FormPropType>({
    enable: true,
    message: null,
    status: 'initial',
    shouldSubmit: false,
    setFormProp: undefined,
    handleUpdate: setShouldUpdate
  })
  const msgApi = useMsgApi()

  const handleOk = () => {
    setFormProp({ ...formProp, shouldSubmit: true, setFormProp })
  }
  const handleClick = () => {
    handleAssignLab({ patient, updateLabs, updatePatients, msgApi })
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

  useEffect(() => {
    if (!shouldUpdate) return
    updateStretchers()
  }, [shouldUpdate, updateStretchers])

  if (!patient) return null

  return (
    <Space size="middle">
      <a onClick={() => setIsOpen(true)}>Editar</a>
      {patient.laboratoryId ? (
        <Link to={`/laboratorio/${patient.laboratoryId}`}>Ver laboratorio</Link>
      ) : (
        <a onClick={handleClick}>Asignar laboratorio</a>
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
