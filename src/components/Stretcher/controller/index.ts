import AxiosController from '../../../utils/axios.controller'

const axios = new AxiosController()

export async function getStretcherVersions(id: string) {
  return await axios.getStretcherListVersion(id, true)
}
