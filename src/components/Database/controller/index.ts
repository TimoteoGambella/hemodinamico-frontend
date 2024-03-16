import AxiosController from '../../../utils/axios.controller'
import { MessageInstance } from 'antd/es/message/interface'
import { LabReportType } from '..'
import { AxiosError } from 'axios'

const axios = new AxiosController()

type LinkLabProps = {
  labs: LaboratoryData[]
  versions: LabVersions[]
}
export function linkLabsWithVersions(props: LinkLabProps): LabReportType[] {
  const { versions, labs } = props
  return labs.map((lab) => {
    const version = versions.filter((v) => v.refId === lab._id)
    return {
      ...lab,
      children: version
        .map((v) => ({ ...v, key: v._id }))
        .sort((a, b) => b.__v - a.__v),
    }
  })
}
type FetchLabsProps = {
  msgApi: MessageInstance
  setter: (data: LabReportType[]) => void
}
export async function fetchReportLabs(props: FetchLabsProps) {
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
            'Error al obtener los laboratorios'
        )
        return
      } else {
        const res = linkLabsWithVersions({
          labs: labs.data.data,
          versions: versions.data.data,
        })
        setter(res)
      }
    }
  )
}
