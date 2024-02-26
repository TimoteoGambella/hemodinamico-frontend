import { createContext, useCallback, useEffect, useState } from 'react'
import AxiosController from '../utils/axios.controller'
import { useNavigate } from 'react-router-dom'

const axios = new AxiosController()

export interface ILoginStatusContext {
  isLogged: boolean,
  updateIsLogged: () => Promise<void>,
}

export const LoginStatusContext = createContext<ILoginStatusContext>({
  isLogged: false,
  updateIsLogged: async () => {},
})

export const LoginStatusProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLogged, setIsLogged] = useState(false)
  const navigateTo = useNavigate()

  const fetchData = useCallback(async () => {
    const isLogged = await axios.checkAuth()
    setIsLogged(isLogged)
    if(!isLogged) navigateTo('/login')
  }, [navigateTo])

  const updateIsLogged = useCallback(async () => {
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
    <LoginStatusContext.Provider value={{ isLogged, updateIsLogged }}>
      {children}
    </LoginStatusContext.Provider>
  )
}
