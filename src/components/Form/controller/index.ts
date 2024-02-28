import AxiosController from '../../../utils/axios.controller'
import { AxiosError, AxiosResponse } from 'axios'

const axios = new AxiosController()

export function validateInputNumber(e: React.ChangeEvent<HTMLInputElement>) {
  const { value } = e.target
  if (isNaN(Number(value))) {
    e.target.value = value.slice(0, -1)
  }
}

interface FormControllerProps {
  formProp: FormPropType
  /**
   * By default is true, if is false, the formProp 
   * will not be updated when the request is successful.
   */
  execSetFormProp?: boolean
  /**
   * Indicates the type of form that will be used and
   * the request that will be made.
   */
  formType: 'user' | 'patient' | 'update-patient' | 'lab' | 'update-stretcher'
}
interface FormFinishProp {
  values: UserData | PatientData | LaboratoryData | StretcherData
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
      else if (formType === 'lab')
        res = await axios.updateLab(values._id, values as LaboratoryData)
      else {
        res = await axios.updateStretcher(values._id, values as StretcherData)
      }

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
