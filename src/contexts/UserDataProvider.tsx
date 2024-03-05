import { AxiosError } from 'axios'
import { createContext, useCallback, useEffect, useState } from 'react'
import AxiosController from '../utils/axios.controller'
import useLoginStatus from '../hooks/useLoginStatus'
import useUserInfo from '../hooks/useUserInfo'
import useMsgApi from '../hooks/useMsgApi'

const axios = new AxiosController()

interface IUserDataContext {
  users: UserData[]
  flushUsers: () => void
  updateUsers: () => Promise<void>
}

export const UserDataContext = createContext<IUserDataContext>({
  users: [],
  flushUsers: () => {},
  updateUsers: async () => {},
})

interface UserDataProviderProps {
  children: React.ReactNode
}

export const UserDataProvider = ({ children }: UserDataProviderProps) => {
  const [users, setUser] = useState<UserData[]>([])
  const isLogged = useLoginStatus()
  const authUser = useUserInfo()
  const msgApi = useMsgApi()

  const fetchData = useCallback(async () => {
    if (!authUser) return
    if (!isLogged || !authUser.isAdmin) return
    const res = await axios.getUsers()
    if (res instanceof AxiosError) {
      console.error(res)
      msgApi.error('No se pudo obtener la información de los usuarios.', 5)
      throw res
    } else {
      setUser(res.data.data)
    }
  }, [msgApi, isLogged, authUser])

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
