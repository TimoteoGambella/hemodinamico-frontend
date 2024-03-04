import { useContext } from 'react'
import { LaboratoryDataContext } from '../contexts/LaboratoryDataProvider'

const useUpdateLabs = () => useContext(LaboratoryDataContext).updateLabs

export default useUpdateLabs
