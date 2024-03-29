import { AxiosError } from 'axios'
import { createContext, useCallback, useEffect, useState } from 'react'
import AxiosController from '../utils/axios.controller'
import useLoginStatus from '../hooks/useLoginStatus'
import useMsgApi from '../hooks/useMsgApi'

const axios = new AxiosController()

interface IPatientDataContext {
  patients: PopulatedPatient[]
  updatePatients: () => Promise<void>
  flushPatients: () => void
}

export const PatientDataContext = createContext<IPatientDataContext>({
  patients: [],
  updatePatients: async () => {},
  flushPatients: () => {},
})

export const PatientDataProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const msgApi = useMsgApi()
  const isLogged = useLoginStatus()
  const [patients, setPatients] = useState<PopulatedPatient[]>([])

  const fetchData = useCallback(async () => {
    if (!isLogged) return
    const res = await axios.getPatients(true)
    if (res instanceof AxiosError) {
      console.error(res)
      msgApi.error('No se pudo obtener la información de los pacientes.', 5)
      throw res
    } else {
      setPatients(res.data.data)
    }
  }, [msgApi, isLogged])

  const updatePatients = useCallback(async () => {
    try {
      await fetchData()
    } catch (error) {
      return Promise.reject(error)
    }
  }, [fetchData])

  const flushPatients = useCallback(() => {
    if (patients.length > 0) setPatients([])
  }, [patients])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return (
    <PatientDataContext.Provider
      value={{ patients, updatePatients, flushPatients }}
    >
      {children}
    </PatientDataContext.Provider>
  )
}
