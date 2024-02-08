import axios, { AxiosError, AxiosInstance, AxiosResponse } from 'axios'

export default class AxiosController {
  private static instance: AxiosController
  private axiosInstance!: AxiosInstance

  constructor() {
    if (AxiosController.instance) return AxiosController.instance

    this.axiosInstance = axios.create({
      baseURL: import.meta.env.VITE_API_BASE_URL+'/api',
      headers: {
        'Content-Type': 'application/json'
      },
      withCredentials: true
    })
    AxiosController.instance = this
  }

  async login(body: FormLogin): Promise<AxiosError | AxiosResponse> {
    try {
      const response = await this.axiosInstance.post('/login', body)
      return response.data
    } catch (error) {
      return error as AxiosError
    }
  }
}
