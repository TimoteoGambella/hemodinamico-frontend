import { AxiosError } from 'axios'
import { createContext, useCallback, useEffect, useState } from 'react'
import AxiosController from '../utils/axios.controller'
import useMsgApi from '../hooks/useMsgApi'

const axios = new AxiosController()

interface ILaboratoryDataContext {
  labs: LaboratoryData[]
  updateLabs: () => Promise<void>
}

const LaboratoryDataContext = createContext<ILaboratoryDataContext>({
  labs: [],
  updateLabs: async () => {},
})

const LaboratoryDataProvider = ({ children }: { children: React.ReactNode }) => {
  const msgApi = useMsgApi()
  const [labs, setLabs] = useState<LaboratoryData[]>([])
  const fetchData = useCallback(async () => {
    const res = await axios.getLabs(true)
    if (res instanceof AxiosError) {
      console.error(res)
      msgApi.error('No se pudo obtener la información de los laboratorios.')
    } else {
      setLabs(res.data.data)
    }
  }, [msgApi])

  const updateLabs = useCallback(async () => {
    await fetchData()
  }, [fetchData])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return (
    <LaboratoryDataContext.Provider value={{ labs, updateLabs }}>
      {children}
    </LaboratoryDataContext.Provider>
  )
}

export { LaboratoryDataContext }
export default LaboratoryDataProvider
