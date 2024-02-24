import { useContext } from 'react'
import { LaboratoryDataContext } from '../contexts/LaboratoryDataProvider'

const useLabs = () => useContext(LaboratoryDataContext).labs

export default useLabs
