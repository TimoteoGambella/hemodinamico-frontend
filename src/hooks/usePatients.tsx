import { useContext } from 'react'
import { PatientDataContext } from '../contexts/PatientDataProvider'

const usePatients = () => useContext(PatientDataContext).patients

export default usePatients
