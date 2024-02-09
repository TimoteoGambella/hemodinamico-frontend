import { CheckOutlined, CloseOutlined } from '@ant-design/icons'
import { Space, TableProps, Tag } from 'antd'

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
      render: () => (
        <Space size="middle">
          <a>Delete</a>
        </Space>
      ),
    },
  ]
}
