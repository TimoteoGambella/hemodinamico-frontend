import { useContext } from 'react'
import { UserInfoContext } from '../contexts/UserInfoProvider'

const useUserInfo = () => useContext(UserInfoContext).userInfo

export default useUserInfo
