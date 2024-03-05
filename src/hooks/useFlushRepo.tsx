import { useCallback, useContext } from 'react'
import { LaboratoryDataContext } from '../contexts/LaboratoryDataProvider'
import { PatientDataContext } from '../contexts/PatientDataProvider'
import { StretcherDataContext } from '../contexts/StretcherDataProvider'
import { UserDataContext } from '../contexts/UserDataProvider'

const useFlushRepo = () => {
  const { flushLabs } = useContext(LaboratoryDataContext)
  const { flushPatients } = useContext(PatientDataContext)
  const { flushStretchers } = useContext(StretcherDataContext)
  const { flushUsers } = useContext(UserDataContext)

  const flushRepo = useCallback(() => {
    flushLabs()
    flushPatients()
    flushStretchers()
    flushUsers()
  }, [flushLabs, flushPatients, flushStretchers, flushUsers])

  return flushRepo
}

export default useFlushRepo
