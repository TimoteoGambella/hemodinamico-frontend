import { MessageInstance } from 'antd/es/message/interface'
import AxiosController from '../../../utils/axios.controller'
import { AxiosError } from 'axios'

const axios = new AxiosController()

interface loadStretcherDataProps {
  id: string
  msgApi: MessageInstance
}
export async function loadStretcherData({ id, msgApi }: loadStretcherDataProps): Promise<StretcherData> {
  return await new Promise((resolve, reject) => {
    axios.getStretcherById(id, true).then((res) => {
      if (res instanceof AxiosError) {
        msgApi.error('Error al cargar la camilla. Inténtelo de nuevo más tarde.')
        return reject(res)
      }
      return resolve(res.data.data)
    })
  })
}
