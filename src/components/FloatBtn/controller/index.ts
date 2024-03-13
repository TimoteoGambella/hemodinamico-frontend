import AxiosController from "../../../utils/axios.controller"
import { MessageInstance } from "antd/es/message/interface"
import { AxiosError, AxiosResponse } from "axios"

const axios = new AxiosController()

export const handleDeleteClick = async(id: string, msgApi: MessageInstance, type: 'lab' | 'stretcher') => {
  let msgToConcat = ''

  if (type === 'lab') msgToConcat = 'laboratorio'
  else if (type === 'stretcher') msgToConcat = 'cama'

  msgApi.open({
    content: `Eliminando ${msgToConcat}...`,
    duration: 0,
    key: 'delete-lab',
    type: 'loading',
  })

  let res: AxiosResponse | AxiosError | undefined

  if (type === 'lab') await axios.deleteLab(id)
  else await axios.deleteStretcher(id)

  if (res instanceof AxiosError) {
    msgApi.error({
      content: `Error al eliminar ${msgToConcat}`,
      key: 'delete-lab',
    })
  } else {
    const firstLetterUpper = msgToConcat.charAt(0).toUpperCase() + msgToConcat.slice(1)
    msgApi.success({
      content: `${firstLetterUpper} eliminado exitosamente`,
      key: 'delete-lab',
    })
  }

  return res
}
