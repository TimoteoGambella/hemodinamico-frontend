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

  async getAuthUser(): Promise<AxiosError | AxiosResponse> {
    return await this.request({
      url: '/auth/user',
      method: 'GET'
    })
  }

  async login(body: FormLogin): Promise<AxiosError | AxiosResponse> {
    return await this.request({
      url: '/auth/login',
      method: 'POST',
      data: body
    })
  }

  async logout(): Promise<AxiosError | AxiosResponse> {
    return await this.request({
      url: '/auth/logout',
      method: 'GET'
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

  async deleteUser(username: string): Promise<AxiosError | AxiosResponse> {
    return await this.request({
      url: `/user/delete/${username}`,
      method: 'DELETE'
    })
  }

  async getPatients(): Promise<AxiosError | AxiosResponse> {
    return await this.request({
      url: '/patient/list',
      method: 'GET'
    })
  }

  async getPatientById(id: string, populate?: boolean): Promise<AxiosError | AxiosResponse> {
    return await this.request({
      url: `/patient/${id}?populate=${populate ?? false}`,
      method: 'GET'
    })
  }

  async createPatient(body: PatientData): Promise<AxiosError | AxiosResponse> {
    return await this.request({
      url: '/patient/create',
      method: 'POST',
      data: body
    })
  }

  async updatePatient(id: string, body: PatientData): Promise<AxiosError | AxiosResponse> {
    return await this.request({
      url: `/patient/update/${id}`,
      method: 'PATCH',
      data: body
    })
  }

  async deletePatient(id: string): Promise<AxiosError | AxiosResponse> {
    return await this.request({
      url: `/patient/delete/${id}`,
      method: 'DELETE'
    })
  }

  async getStretchers(populate = false): Promise<AxiosError | AxiosResponse> {
    return await this.request({
      url: `/stretcher/list?populate=${populate}`,
      method: 'GET'
    })
  }

  async getStretcherById(id: string, populate = false): Promise<AxiosError | AxiosResponse> {
    return await this.request({
      url: `/stretcher/${id}?populate=${populate}`,
      method: 'GET'
    })
  }

  async updateStretcher(id: string, body: StretcherData): Promise<AxiosError | AxiosResponse> {
    return await this.request({
      url: `/stretcher/update/${id}`,
      method: 'PUT',
      data: body
    })
  }

  async getLabs(populate = false): Promise<AxiosError | AxiosResponse> {
    return await this.request({
      url: `/laboratory/list?populate=${populate}`,
      method: 'GET'
    })
  }

  async getLab(id: string, populate = false): Promise<AxiosError | AxiosResponse> {
    return await this.request({
      url: `/laboratory/${id}?populate=${populate}`,
      method: 'GET'
    })
  }

  async deleteLab(id: string): Promise<AxiosError | AxiosResponse> {
    return await this.request({
      url: `/laboratory/delete/${id}`,
      method: 'DELETE'
    })
  }

  async createLab(body: { patientId: string }): Promise<AxiosError | AxiosResponse> {
    return await this.request({
      url: '/laboratory/create',
      method: 'POST',
      data: body
    })
  }

  async updateLab(id: string, body: LaboratoryData): Promise<AxiosError | AxiosResponse> {
    return await this.request({
      url: `/laboratory/update/${id}`,
      method: 'PATCH',
      data: body
    })
  }

  async getLabListVersion(id: string, populate: boolean): Promise<AxiosError | AxiosResponse> {
    return await this.request({
      url: `/laboratory/list/versions/${id}?populate=${populate}`,
      method: 'GET'
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
