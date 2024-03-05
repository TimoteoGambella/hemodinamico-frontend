import { UserDataContext } from '../../contexts/UserDataProvider'
import { useContext, useEffect, useState } from 'react'
import { Button, Modal, Table, Typography } from 'antd'
import useUserInfo from '../../hooks/useUserInfo'
import { PlusOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import useMsgApi from '../../hooks/useMsgApi'
import { getColumns } from './controller'
import CustomForm from '../Form'
import './style.css'

interface UsersProps {}

// eslint-disable-next-line no-empty-pattern
const Users = ({}: UsersProps) => {
  const authUser = useUserInfo()
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { users, updateUsers } = useContext(UserDataContext)
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
  const navigateTo = useNavigate()

  const handleOk = () => {
    setFormProp({ ...formProp, shouldSubmit: true, setFormProp })
  }

  useEffect(() => {
    if (authUser?.isAdmin === false) {
      msgApi.warning('No tienes permisos para acceder a esta sección.')
      navigateTo('/dashboard')
    }
  }, [authUser, navigateTo, msgApi])

  useEffect(() => {
    if (!shouldGetUsers) return

    setIsLoading(true)
    updateUsers().then(() => {
      setShouldGetUsers(false)
      setIsLoading(false)
    })
  }, [shouldGetUsers, updateUsers])

  useEffect(() => {
    if (formProp.shouldSubmit) return

    if (formProp.status === 'ok') {
      msgApi.success('Usuario creado con éxito.')
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

  if (authUser?.isAdmin === false) return null

  return (
    <>
      <Typography.Title>Lista de usuarios</Typography.Title>
      <Button
        type="primary"
        shape="round"
        icon={<PlusOutlined />}
        size="large"
        className='add-user-button'
        onClick={() => setOpen(true)}
      />
      <Modal
        title="Registro de usuario"
        open={open}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        onCancel={() => setOpen(false)}
      >
        <CustomForm.User formProp={formProp} />
      </Modal>
      <Table
        bordered
        loading={isLoading}
        columns={columns}
        rowKey={(user) => user._id}
        dataSource={users}
        className="table-users"
      />
    </>
  )
}

export default Users
