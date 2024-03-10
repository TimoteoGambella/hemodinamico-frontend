import AxiosController from '../../../utils/axios.controller'

const axios = new AxiosController()

export async function getLabVersions(id: string) {
  return await axios.getLabListVersion(id, true)
}
