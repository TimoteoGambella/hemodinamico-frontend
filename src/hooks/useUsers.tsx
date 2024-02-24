import { useContext } from 'react'
import { UserDataContext } from '../contexts/UserDataProvider'

const useUsers = () => useContext(UserDataContext).users

export default useUsers
