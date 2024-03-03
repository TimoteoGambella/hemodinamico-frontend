import { Button, Modal, Table, Typography } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import usePatients from '../../hooks/usePatients'
import useMsgApi from '../../hooks/useMsgApi'
import { useEffect, useState } from 'react'
import { getColumns } from './controller'
import CustomForm from '../Form'
import './style.css'

interface PateintsProps {}

// eslint-disable-next-line no-empty-pattern
const Patients = ({}: PateintsProps) => {
  const [open, setOpen] = useState(false)
  const data = usePatients()
  const [confirmLoading, setConfirmLoading] = useState(false)
  const [formProp, setFormProp] = useState<FormPropType>({
    enable: true,
    message: null,
    status: 'initial',
    shouldSubmit: false,
    setFormProp: undefined,
  })
  const msgApi = useMsgApi()
  const columns = getColumns()

  const handleOk = () => {
    setFormProp({ ...formProp, shouldSubmit: true, setFormProp })
  }

  useEffect(() => {
    if (formProp.shouldSubmit) return

    if (formProp.status === 'ok') {
      msgApi.success('Paciente creado con éxito.')
      setOpen(false)
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
        className='add-user-button'
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
        columns={columns}
        rowKey={(user) => user._id}
        dataSource={data}
        className="table-patients"
      />
    </>
  )
}

export default Patients
