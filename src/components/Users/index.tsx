import { Table } from 'antd'
import { useEffect, useState } from 'react'
import { AxiosError } from 'axios'
import AxiosController from '../../utils/axios.controller'
import { getColumns } from './controller'

const axios = new AxiosController()

const Users = () => {
  const [data, setData] = useState<UserData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const columns = getColumns()

  useEffect(() => {
    axios.getUsers().then((response) => {
      if (response instanceof AxiosError) return console.error(response.message)
      setData(response.data.data as UserData[])
      setIsLoading(false)
    })
  }, [])

  return (
    <Table
      loading={isLoading}
      columns={columns}
      rowKey={(user) => user._id}
      dataSource={data}
    />
  )
}

export default Users
