import { AxiosError } from 'axios'
import { createContext, useCallback, useEffect, useState } from 'react'
import AxiosController from '../utils/axios.controller'
import useMsgApi from '../hooks/useMsgApi'

const axios = new AxiosController()

interface IStretcherDataContext {
  stretchers: StretcherData[] | null
  updateStretchers: () => Promise<void>
}

export const StretcherDataContext = createContext<IStretcherDataContext>({
  stretchers: null,
  updateStretchers: async () => {},
})

export const StretcherDataProvider = ({ children }: { children: React.ReactNode }) => {
  const msgApi = useMsgApi()
  const [stretchers, setStretchers] = useState<StretcherData[] | null>(null)
  const fetchData = useCallback(async () => {
    const res = await axios.getStretchers(true)
    if (res instanceof AxiosError) {
      console.error(res)
      msgApi.error('No se pudo obtener la información de las camas.')
      throw res
    } else {
      setStretchers(res.data.data)
    }
  }, [msgApi])

  const updateStretchers = useCallback(async () => {
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
    <StretcherDataContext.Provider value={{ stretchers, updateStretchers }}>
      {children}
    </StretcherDataContext.Provider>
  )
}
