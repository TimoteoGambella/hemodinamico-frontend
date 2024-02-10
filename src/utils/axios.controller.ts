import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'

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

  async checkAuth(): Promise<boolean> {
    const response = await this.request({
      url: '/auth/session',
      method: 'GET'
    })

    return response.status === 200
  }

  async login(body: FormLogin): Promise<AxiosError | AxiosResponse> {
    return await this.request({
      url: '/auth/login',
      method: 'POST',
      data: body
    })
  }

  async getUsers(): Promise<AxiosError | AxiosResponse> {
    return await this.request({
      url: '/user/list',
      method: 'GET'
    })
  }

  async createUser(body: UserData): Promise<AxiosError | AxiosResponse> {
    return await this.request({
      url: '/user/create',
      method: 'POST',
      data: body
    })
  }

  private async request<T>(config: AxiosRequestConfig): Promise<AxiosError | AxiosResponse<T>> {
    try {
      const response = await this.axiosInstance.request<T>(config)
      return response
    } catch (error) {
      return error as AxiosError
    }
  }
}
