import { CheckOutlined, CloseOutlined } from '@ant-design/icons'
import AxiosController from '../../../utils/axios.controller'
import { MessageInstance } from 'antd/es/message/interface'
import DeleteAction from './DeleteAction'
import { TableProps, Tag } from 'antd'
import { AxiosError } from 'axios'

const axios = new AxiosController()

export function getColumns(): TableProps<UserData>['columns'] {
  return [
    {
      title: 'Nombre',
      dataIndex: 'name',
      key: 'name',
      render: (text) => <a>{text}</a>,
    },
    {
      title: 'Apellido',
      dataIndex: 'lastName',
      key: 'lastName',
    },
    {
      title: 'Usuario',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: 'Admin',
      key: 'isAdmin',
      dataIndex: 'isAdmin',
      render: (_, { isAdmin }, index) => {
        return (
          <Tag color={isAdmin ? 'green' : 'volcano'} key={index}>
            {isAdmin ? <CheckOutlined /> : <CloseOutlined />}
          </Tag>
        )
      },
    },
    {
      title: 'Action',
      key: 'action',
      render: (record) => <DeleteAction record={record} />,
    },
  ]
}

export async function handleUserDelete(username: string, msgApi: MessageInstance) {
  msgApi.open({
    type: 'loading',
    content: 'Realizando solicitud...',
    duration: 0,
    key: 'delete-user',
  })
  const res = await axios.deleteUser(username)
  msgApi.destroy('delete-user')
  if (res instanceof AxiosError) {
    console.error(res)
    msgApi.error(
      (res.response?.data as { message: string })?.message ||
        'Error desconocido',
      5
    )
    return false
  } else {
    msgApi.success('Usuario eliminado con exito')
    return true
  }
}
