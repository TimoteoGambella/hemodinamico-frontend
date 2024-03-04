import { useContext } from 'react'
import { PatientDataContext } from '../contexts/PatientDataProvider'

const useUpdatePatients = () => useContext(PatientDataContext).updatePatients

export default useUpdatePatients
