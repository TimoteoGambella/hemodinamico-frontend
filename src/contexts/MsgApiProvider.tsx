import { MessageInstance } from 'antd/es/message/interface'
import { createContext } from 'react'
import { message } from 'antd'

interface MsgApiContextProps {
  msgApi: MessageInstance | null
  contextHolder: React.ReactNode | null
}
const MsgApiContext = createContext<MsgApiContextProps>({
  msgApi: null,
  contextHolder: null,
})

const MsgApiProvider = ({ children }: { children: React.ReactNode }) => {
  const [msgApi, contextHolder] = message.useMessage()

  return (
    <MsgApiContext.Provider value={{ msgApi, contextHolder }}>
      {children}
    </MsgApiContext.Provider>
  )
}

export { MsgApiContext }
export default MsgApiProvider
