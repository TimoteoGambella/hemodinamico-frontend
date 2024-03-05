import { useContext } from 'react'
import { UserInfoContext } from '../contexts/UserInfoProvider'

const useSetUserInfo = () => useContext(UserInfoContext).setUserInfo

export default useSetUserInfo
