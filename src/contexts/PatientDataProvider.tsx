import { AxiosError } from 'axios'
import { createContext, useCallback, useEffect, useState } from 'react'
import AxiosController from '../utils/axios.controller'
import useLoginStatus from '../hooks/useLoginStatus'
import useMsgApi from '../hooks/useMsgApi'

const axios = new AxiosController()

interface IPatientDataContext {
  patients: PatientData[]
  updatePatients: () => Promise<void>
}

export const PatientDataContext = createContext<IPatientDataContext>({
  patients: [],
  updatePatients: async () => {},
})

export const PatientDataProvider = ({ children }: { children: React.ReactNode }) => {
  const msgApi = useMsgApi()
  const isLogged = useLoginStatus()
  const [patients, setStretchers] = useState<PatientData[]>([])
  const fetchData = useCallback(async () => {
    if (!isLogged) return
    const res = await axios.getPatients()
    if (res instanceof AxiosError) {
      console.error(res)
      msgApi.error('No se pudo obtener la información de los pacientes.')
      throw res
    } else {
      setStretchers(res.data.data)
    }
  }, [msgApi, isLogged])

  const updatePatients = useCallback(async () => {
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
    <PatientDataContext.Provider value={{ patients, updatePatients }}>
      {children}
    </PatientDataContext.Provider>
  )
}
