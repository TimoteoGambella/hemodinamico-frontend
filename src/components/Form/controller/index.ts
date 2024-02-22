import AxiosController from '../../../utils/axios.controller'
import { AxiosError, AxiosResponse } from 'axios'

const axios = new AxiosController()

export function validateInputNumber(e: React.ChangeEvent<HTMLInputElement>) {
  const { value } = e.target
  if (isNaN(Number(value))) {
    e.target.value = value.slice(0, -1)
  }
}

export async function getStretchers(): Promise<StretcherData[] | null> {
  const res = await axios.getStretchers()
  if (res instanceof AxiosError) {
    console.error(res.message)
    return null
  }
  return res.data.data
}

interface FormControllerProps {
  formProp: FormPropType
  execSetFormProp?: boolean
  formType: 'user' | 'patient' | 'update-patient' | 'lab'
}
interface FormFinishProp {
  values: UserData | PatientData | LaboratoryData
}

export function FormController(
  { formProp, formType, execSetFormProp }: FormControllerProps,
  callback?: (_: AxiosError | AxiosResponse) => void
) {
  return {
    onFinish: async (values: FormFinishProp['values']) => {
      console.log('Received values of form: ', values)
      formProp.setFormProp?.({
        ...formProp,
        shouldSubmit: false,
        status: 'loading',
      })

      let res: AxiosError | AxiosResponse
      if (formType === 'user') res = await axios.createUser(values as UserData)
      else if (formType === 'patient')
        res = await axios.createPatient(values as PatientData)
      else if (formType === 'update-patient')
        res = await axios.updatePatient(values._id, values as PatientData)
      else res = await axios.updateLab(values._id, values as LaboratoryData)

      if (res instanceof AxiosError) {
        formProp.setFormProp?.({
          ...formProp,
          shouldSubmit: false,
          status: 'server-error',
          message:
            (res.response?.data as { message: string })?.message ||
            'Error desconocido. Por favor intente de nuevo.',
        })
        console.info('Message error', res.response?.data)
      } else {
        if (execSetFormProp === undefined || execSetFormProp)
          formProp.setFormProp?.({
            ...formProp,
            shouldSubmit: false,
            status: 'ok',
          })
      }
      if (callback) callback(res)
    },
    onFinishFailed: () => {
      formProp.setFormProp?.({
        ...formProp,
        shouldSubmit: false,
        status: 'form-error',
        message: 'Por favor corrija los campos resaltados.',
      })
    }
  }
}
