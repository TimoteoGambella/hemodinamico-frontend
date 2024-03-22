import { useContext } from 'react'
import { PatientDataContext } from '../contexts/PatientDataProvider'

const usePatients = () => {
  const data = useContext(PatientDataContext).patients

  return JSON.parse(JSON.stringify(data)) as PopulatedPatient[]
}

export default usePatients
