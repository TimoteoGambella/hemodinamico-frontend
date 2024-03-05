import { AxiosError } from 'axios'
import { createContext, useCallback, useEffect, useState } from 'react'
import AxiosController from '../utils/axios.controller'
import useLoginStatus from '../hooks/useLoginStatus'
import useMsgApi from '../hooks/useMsgApi'

const axios = new AxiosController()

interface IUserDataContext {
  users: UserData[]
  updateUsers: () => Promise<void>
  flushUsers: () => void
}

export const UserDataContext = createContext<IUserDataContext>({
  users: [],
  updateUsers: async () => {},
  flushUsers: () => {},
})

export const UserDataProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const msgApi = useMsgApi()
  const isLogged = useLoginStatus()
  const [users, setUser] = useState<UserData[]>([])

  const fetchData = useCallback(async () => {
    if (!isLogged) return
    const res = await axios.getUsers()
    if (res instanceof AxiosError) {
      console.error(res)
      msgApi.error('No se pudo obtener la información de los usuarios.', 5)
      throw res
    } else {
      setUser(res.data.data)
    }
  }, [msgApi, isLogged])

  const updateUsers = useCallback(async () => {
    try {
      await fetchData()
    } catch (error) {
      return Promise.reject(error)
    }
  }, [fetchData])

  const flushUsers = useCallback(() => {
    if (users.length > 0) setUser([])
  }, [users])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return (
    <UserDataContext.Provider value={{ users, updateUsers, flushUsers }}>
      {children}
    </UserDataContext.Provider>
  )
}
