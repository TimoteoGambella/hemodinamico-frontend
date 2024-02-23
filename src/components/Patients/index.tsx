import { AxiosError } from 'axios'
import { getColumns } from './controller'
import { PlusOutlined } from '@ant-design/icons'
import { useEffect, useState } from 'react'
import { Button, Modal, Table, Typography } from 'antd'
import AxiosController from '../../utils/axios.controller'
import useMsgApi from '../../hooks/useMsgApi'
import CustomForm from '../Form'
import './style.css'

interface PateintsProps {}

const axios = new AxiosController()

// eslint-disable-next-line no-empty-pattern
const Patients = ({}: PateintsProps) => {
  const [open, setOpen] = useState(false)
  const [data, setData] = useState<PatientData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [shouldGetUsers, setShouldGetUsers] = useState(true)
  const [confirmLoading, setConfirmLoading] = useState(false)
  const [formProp, setFormProp] = useState<FormPropType>({
    shouldSubmit: false,
    message: null,
    status: 'initial',
    setFormProp: undefined,
    enable: true,
  })
  const msgApi = useMsgApi()
  const columns = getColumns()

  const handleOk = () => {
    setFormProp({ ...formProp, shouldSubmit: true, setFormProp })
  }

  useEffect(() => {
    if (!shouldGetUsers) return

    axios.getPatients().then((response) => {
      if (response instanceof AxiosError) return console.error(response.message)
      setData(response.data.data as PatientData[])
      setShouldGetUsers(false)
      setIsLoading(false)
    })
  }, [shouldGetUsers])

  useEffect(() => {
    if (formProp.shouldSubmit) return

    // console.log('formProp', formProp)

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
        className='table-patients'
      />
    </>
  )
}

export default Patients
