import { getColumns } from './controller'
import { PlusOutlined } from '@ant-design/icons'
import { useContext, useEffect, useState } from 'react'
import { Button, Modal, Table, Typography } from 'antd'
import { PatientDataContext } from '../../contexts/PatientDataProvider'
import useMsgApi from '../../hooks/useMsgApi'
import CustomForm from '../Form'
import './style.css'

interface PateintsProps {}

// eslint-disable-next-line no-empty-pattern
const Patients = ({}: PateintsProps) => {
  const [open, setOpen] = useState(false)
  const { patients: data, updatePatients } = useContext(PatientDataContext)
  const [isLoading, setIsLoading] = useState(false)
  const [shouldGetUsers, setShouldGetUsers] = useState(false)
  const [confirmLoading, setConfirmLoading] = useState(false)
  const [formProp, setFormProp] = useState<FormPropType>({
    enable: true,
    message: null,
    status: 'initial',
    shouldSubmit: false,
    setFormProp: undefined,
    handleUpdate: setShouldGetUsers
  })
  const msgApi = useMsgApi()
  const columns = getColumns()

  const handleOk = () => {
    setFormProp({ ...formProp, shouldSubmit: true, setFormProp })
  }

  useEffect(() => {
    if (!shouldGetUsers) return

    setIsLoading(true)
    updatePatients().then(() => {
      setIsLoading(false)
      setShouldGetUsers(false)
    })
  }, [shouldGetUsers, updatePatients])

  useEffect(() => {
    if (formProp.shouldSubmit) return

    if (formProp.status === 'ok') {
      msgApi.success('Paciente creado con éxito.')
      setOpen(false)
      setShouldGetUsers(true)
      setConfirmLoading(false)
      setFormProp({ ...formProp, status: 'initial', message: null })
    } else if (formProp.status === 'form-error') {
      msgApi.warning(formProp.message)
      setFormProp({ ...formProp, status: 'initial', message: null })
    } else if (formProp.status === 'server-error') {
      msgApi.error(formProp.message)
      setConfirmLoading(false)
      setFormProp({ ...formProp, status: 'initial', message: null })
    } else if (formProp.status === 'loading') {
      setConfirmLoading(true)
    }
  }, [formProp, msgApi])

  return (
    <>
      <Typography.Title>Lista de pacientes</Typography.Title>
      <Button
        type="primary"
        shape="round"
        icon={<PlusOutlined />}
        size="large"
        onClick={() => setOpen(true)}
      />
      <Modal
        title="Registro de pacientes"
        open={open}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        onCancel={() => setOpen(false)}
      >
        <CustomForm.Patients formProp={formProp} />
      </Modal>
      <Table
        bordered
        loading={isLoading}
        columns={columns}
        rowKey={(user) => user._id}
        dataSource={data}
        className="table-patients"
      />
    </>
  )
}

export default Patients
