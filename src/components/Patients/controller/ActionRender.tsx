import useUpdateStretchers from '../../../hooks/useUpdateStretcher'
import DeleteBtn from '../../Form/EditableTable/items/DeleteBtn'
import useUpdatePatients from '../../../hooks/useUpdatePatients'
import useUpdateLabs from '../../../hooks/useUpdateLabs'
import { handleAssignLab, handleDeletePatient } from '.'
import usePatients from '../../../hooks/usePatients'
import useMsgApi from '../../../hooks/useMsgApi'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Space, Modal } from 'antd'
import CustomForm from '../../Form'
import { DataSourceType } from '../../Form/EditableTable'

interface ActionRenderProps {
  data: PatientData['_id']
}

const ActionRender = ({ data }: ActionRenderProps) => {
  const updateLabs = useUpdateLabs()
  const updatePatients = useUpdatePatients()
  const [IsOpen, setIsOpen] = useState(false)
  const updateStretchers = useUpdateStretchers()
  const [isCancel, setIsCancel] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isDisabled, setIsDisabled] = useState(true)
  const [shouldUpdate, setShouldUpdate] = useState(false)
  const patient = usePatients().find((p) => p._id === data)
  const [formProp, setFormProp] = useState<FormPropType>({
    enable: true,
    message: null,
    status: 'initial',
    shouldSubmit: false,
    setFormProp: undefined,
    handleUpdate: setShouldUpdate,
  })
  const msgApi = useMsgApi()

  const handleOk = () => {
    setFormProp({ ...formProp, shouldSubmit: true, setFormProp })
  }
  const handleClick = () => {
    handleAssignLab({ patient, updateLabs, updatePatients, msgApi })
  }
  const handleDelete = async (id: React.Key) => {
    const res = await handleDeletePatient(id, msgApi)
    if (res) updatePatients()
  }

  useEffect(() => {
    if (formProp.shouldSubmit) return

    if (formProp.status === 'ok') {
      setIsLoading(false)
      setIsOpen(false)
      setFormProp({ ...formProp, status: 'initial', message: null })
    } else if (formProp.status === 'loading') {
      setIsLoading(true)
    }
  }, [formProp, msgApi])

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
      <DeleteBtn
        record={{ key: patient._id } as DataSourceType}
        handleDelete={handleDelete}
        dataSource={new Array(1).fill(null)}
      />
    </Space>
  )
}

export default ActionRender
