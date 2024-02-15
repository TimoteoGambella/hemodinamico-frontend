import { FormInstance } from 'antd'
import AxiosController from '../../../utils/axios.controller'
import { AxiosError } from 'axios'

const axios = new AxiosController()

export function validateInputNumber(e: React.ChangeEvent<HTMLInputElement>) {
  const { value } = e.target
  if (isNaN(Number(value))) {
    e.target.value = value.slice(0, -1)
  }
}

export async function getStretchers(): Promise<StretcherData[] | null>{
  const res = await axios.getStretchers()
  if (res instanceof AxiosError) {
    console.error(res.message)
    return null
  }
  return res.data.data
}

interface FormControllerProps {
  formProp: FormPropType
  form: FormInstance<UserData | PatientData>
  formType: 'user' | 'patient'
}

export function UserFormController({ formProp, form, formType }: FormControllerProps) {
  return {
    onFinish: async (values: UserData | PatientData) => {
      console.log('Received values of form: ', values)
      formProp.setFormProp?.({
        ...formProp,
        shouldSubmit: false,
        status: 'loading',
      })
      const res = formType === 'user'
        ? await axios.createUser(values as UserData)
        : await axios.createPatient(values as PatientData)
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
        formProp.setFormProp?.({ ...formProp, shouldSubmit: false, status: 'ok' })
        form.resetFields()
      }
    },
    onFinishFailed: () => {
      formProp.setFormProp?.({
        ...formProp,
        shouldSubmit: false,
        status: 'form-error',
        message: 'Por favor corrija los campos resaltados.',
      })
    },
    formItemLayout: {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    }
  }
}
