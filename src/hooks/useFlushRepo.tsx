import { useCallback, useContext } from 'react'
import { LaboratoryDataContext } from '../contexts/LaboratoryDataProvider'
import { PatientDataContext } from '../contexts/PatientDataProvider'
import { StretcherDataContext } from '../contexts/StretcherDataProvider'
import { UserDataContext } from '../contexts/UserDataProvider'
import { UserInfoContext } from '../contexts/UserInfoProvider'

const useFlushRepo = () => {
  const { flushLabs } = useContext(LaboratoryDataContext)
  const { flushPatients } = useContext(PatientDataContext)
  const { flushStretchers } = useContext(StretcherDataContext)
  const { flushUsers } = useContext(UserDataContext)
  const { flushUserInfo } = useContext(UserInfoContext)

  const flushRepo = useCallback(() => {
    flushLabs()
    flushUsers()
    flushUserInfo()
    flushPatients()
    flushStretchers()
  }, [flushLabs, flushUsers, flushUserInfo, flushPatients, flushStretchers])

  return flushRepo
}

export default useFlushRepo
