/* eslint-disable @typescript-eslint/no-explicit-any */
import AxiosController from '../../../utils/axios.controller'
import { MessageInstance } from 'antd/es/message/interface'
import { LabReportType, StretcherReportType } from '..'
import { AxiosError } from 'axios'

const axios = new AxiosController()

type LinkLabProps = {
  data: LaboratoryData[] | StretcherData[]
  versions: LabVersions[] | StretcherVersions[]
}
export function linkWithVersions(props: LinkLabProps): LabReportType[] | StretcherReportType[] {
  const { versions, data } = props
  return data.map((item) => {
    const version = versions.filter((v) => v.refId === item._id)
    return {
      ...item,
      children: version
        .map((v) => ({ ...v, key: v._id }))
        .sort((a, b) => b.__v - a.__v),
    }
  }) as LabReportType[] | StretcherReportType[]
}

type ControllerProps = {
  msgApi: MessageInstance
  setter: (data: any[]) => void
}
export async function fetchReportLabs(props: ControllerProps) {
  const { msgApi, setter } = props
  Promise.all([axios.getLabs(true, true), axios.getLabVersions(true)]).then(
    ([labs, versions]) => {
      if (labs instanceof AxiosError) {
        msgApi.error(
          (labs.response?.data as { message: string }).message ??
            'Error al obtener los laboratorios'
        )
        return
      } else if (versions instanceof AxiosError) {
        msgApi.error(
          (versions.response?.data as { message: string }).message ??
            'Error al obtener las versiones de laboratorios'
        )
        return
      } else {
        const res = linkWithVersions({
          data: labs.data.data,
          versions: versions.data.data,
        })
        setter(res)
      }
    }
  )
}

export async function fetchReportStretchers(props: ControllerProps) {
  const { msgApi, setter } = props
  Promise.all([axios.getStretchers(true, true), axios.getStretcherVersions(true)]).then(
    ([stretchers, versions]) => {
      if (stretchers instanceof AxiosError) {
        msgApi.error(
          (stretchers.response?.data as { message: string }).message ??
            'Error al obtener las camas'
        )
        return
      } else if (versions instanceof AxiosError) {
        msgApi.error(
          (versions.response?.data as { message: string }).message ??
            'Error al obtener las versiones de las camas'
        )
        return
      } else {
        const res = linkWithVersions({
          data: (stretchers.data.data as StretcherData[]).filter((item) => item.patientId !== null),
          versions: (versions.data.data as StretcherVersions[]).filter((item) => item.__v !== 0),
        })
        setter(res)
      }
    }
  )
}
