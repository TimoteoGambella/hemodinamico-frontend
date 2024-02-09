import { MessageInstance } from 'antd/es/message/interface'
import AxiosController from '../../../utils/axios.controller'

interface handleSubmitProps {
  setIsLoading: (value: boolean) => void
  msgApi: MessageInstance
  navigateTo: (path: string) => void
}

const axios = new AxiosController()

export const handleSubmit =
  ({ setIsLoading, msgApi, navigateTo }: handleSubmitProps) =>
  async (values: FormLogin) => {
    setIsLoading(true)
    const res = await axios.login(values)
    setIsLoading(false)

    if ('isAxiosError' in res && res.isAxiosError && res.response) {
      if (res.request.status === 401) {
        msgApi.open({
          type: 'error',
          content: (res.response.data as { message?: string })?.message,
        })
        return
      } else if (res.request.status !== 200) {
        msgApi.open({
          type: 'error',
          content:
            (res.response.data as { message?: string })?.message ||
            'Error en el servidor',
        })
        console.error(res)
        return
      }
    } else {
      msgApi.open({
        type: 'success',
        content: 'Inicio de sesión exitoso',
      })
      console.log(res)
      navigateTo('/dashboard')
    }
  }
