import { AxiosError } from 'axios'
import { createContext, useCallback, useEffect, useState } from 'react'
import AxiosController from '../utils/axios.controller'
import useMsgApi from '../hooks/useMsgApi'

const axios = new AxiosController()

interface IPatientDataContext {
  patients: PatientData[]
  updatePatients: () => Promise<void>
}

const PatientDataContext = createContext<IPatientDataContext>({
  patients: [],
  updatePatients: async () => {},
})

const PatientDataProvider = ({ children }: { children: React.ReactNode }) => {
  const msgApi = useMsgApi()
  const [patients, setStretchers] = useState<PatientData[]>([])
  const fetchData = useCallback(async () => {
    const res = await axios.getPatients()
    if (res instanceof AxiosError) {
      console.error(res)
      msgApi.error('No se pudo obtener la información de los pacientes.')
      throw res
    } else {
      setStretchers(res.data.data)
    }
  }, [msgApi])

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

export { PatientDataContext }
export default PatientDataProvider
