import { useContext } from 'react'
import { LoginStatusContext } from '../contexts/LoginStatusProvider'

const useLoginStatus = () => useContext(LoginStatusContext).isLogged

export default useLoginStatus
