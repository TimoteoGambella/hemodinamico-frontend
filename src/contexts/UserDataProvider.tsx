import { AxiosError } from 'axios'
import { createContext, useCallback, useEffect, useState } from 'react'
import AxiosController from '../utils/axios.controller'
import useMsgApi from '../hooks/useMsgApi'

const axios = new AxiosController()

interface IUserDataContext {
  users: UserData[]
  updateUsers: () => Promise<void>
}

export const UserDataContext = createContext<IUserDataContext>({
  users: [],
  updateUsers: async () => {},
})

export const UserDataProvider = ({ children }: { children: React.ReactNode }) => {
  const msgApi = useMsgApi()
  const [users, setUser] = useState<UserData[]>([])
  const fetchData = useCallback(async () => {
    const res = await axios.getUsers()
    if (res instanceof AxiosError) {
      console.error(res)
      msgApi.error('No se pudo obtener la información de los usuarios.')
      throw res
    } else {
      setUser(res.data.data)
    }
  }, [msgApi])

  const updateUsers = useCallback(async () => {
    try {
      await fetchData()
    } catch (error) {
      return Promise.reject(error)
    }
  }, [fetchData])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return (
    <UserDataContext.Provider value={{ users, updateUsers }}>
      {children}
    </UserDataContext.Provider>
  )
}
