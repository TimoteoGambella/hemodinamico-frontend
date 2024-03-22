import { AxiosError } from 'axios'
import { createContext, useCallback, useEffect, useState } from 'react'
import AxiosController from '../utils/axios.controller'
import useLoginStatus from '../hooks/useLoginStatus'
import useMsgApi from '../hooks/useMsgApi'

const axios = new AxiosController()

interface ILaboratoryDataContext {
  labs: PopulatedLab[]
  updateLabs: () => Promise<void>
  flushLabs: () => void
}

export const LaboratoryDataContext = createContext<ILaboratoryDataContext>({
  labs: [],
  updateLabs: async () => {},
  flushLabs: () => {},
})

export const LaboratoryDataProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const msgApi = useMsgApi()
  const isLogged = useLoginStatus()
  const [labs, setLabs] = useState<PopulatedLab[]>([])

  const fetchData = useCallback(async () => {
    if (!isLogged) return
    const res = await axios.getLabs(true)
    if (res instanceof AxiosError) {
      console.error(res)
      msgApi.error('No se pudo obtener la información de los laboratorios.', 5)
      throw res
    } else {
      setLabs(res.data.data)
    }
  }, [msgApi, isLogged])

  const updateLabs = useCallback(async () => {
    try {
      await fetchData()
    } catch (error) {
      return Promise.reject(error)
    }
  }, [fetchData])

  const flushLabs = useCallback(() => {
    if (labs.length > 0) setLabs([])
  }, [labs])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return (
    <LaboratoryDataContext.Provider value={{ labs, updateLabs, flushLabs }}>
      {children}
    </LaboratoryDataContext.Provider>
  )
}
