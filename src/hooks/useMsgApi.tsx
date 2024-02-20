import { useContext } from 'react'
import { MsgApiContext } from '../contexts/MsgApiProvider'

const useMsgApi = () => {
  const { msgApi } = useContext(MsgApiContext)
  if (!msgApi) throw new Error('msgApi is not loaded')
  return msgApi
}

export default useMsgApi
