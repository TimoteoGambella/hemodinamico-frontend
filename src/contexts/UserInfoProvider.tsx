import { createContext, useCallback, useEffect, useState } from 'react'
import useLoginStatus from '../hooks/useLoginStatus'
import AxiosController from '../utils/axios.controller'
import useMsgApi from '../hooks/useMsgApi'
import { AxiosError } from 'axios'

const axios = new AxiosController()

interface IUserDataContext {
  flushUserInfo: () => void
  userInfo: AuthUserData | null
  updateUserInfo: () => Promise<void>
}

export const UserInfoContext = createContext<IUserDataContext>({
  userInfo: null,
  flushUserInfo: () => {},
  updateUserInfo: async () => {},
})

interface UserDataProviderProps {
  children: React.ReactNode
}

export const UserInfoProvider = ({ children }: UserDataProviderProps) => {
  const [userInfo, setUserInfo] = useState<AuthUserData | null>(null)
  const isLogged = useLoginStatus()
  const msgApi = useMsgApi()

  const fetchData = useCallback(async () => {
    if (!isLogged) return
    const res = await axios.getAuthUser()
    if (res instanceof AxiosError) {
      console.error(res)
      msgApi.error('No se pudo obtener tu información.', 5)
      throw res
    } else {
      setUserInfo(res.data)
    }
  }, [msgApi, isLogged])

  const updateUserInfo = useCallback(async () => {
    try {
      await fetchData()
    } catch (error) {
      return Promise.reject(error)
    }
  }, [fetchData])

  const flushUserInfo = useCallback(() => {
    setUserInfo(null)
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return (
    <UserInfoContext.Provider
      value={{ userInfo, updateUserInfo, flushUserInfo }}
    >
      {children}
    </UserInfoContext.Provider>
  )
}
