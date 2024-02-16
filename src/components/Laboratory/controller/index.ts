import { MessageInstance } from 'antd/es/message/interface'
import AxiosController from '../../../utils/axios.controller'
import { AxiosError } from 'axios'

const axios = new AxiosController()

interface loadLabDataProps {
  id: string
  msgApi: MessageInstance
}
export async function loadLabData({ id, msgApi }: loadLabDataProps): Promise<LaboratoryData> {
  return await new Promise((resolve, reject) => {
    axios.getLab(id, true).then((res) => {
      if (res instanceof AxiosError) {
        msgApi.error('Error al cargar la información del laboratorio. Inténtelo de nuevo más tarde.')
        return reject(res)
      }
      return resolve(res.data.data)
    })
  })
}
