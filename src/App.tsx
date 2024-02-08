import Login from "./components/Login"
import { message } from "antd"

export default function App() {
  const [messageApi, contextHolder] = message.useMessage()

  return (
    <>
      {contextHolder}
      <Login msgApi={messageApi} />
    </>
  )
}
