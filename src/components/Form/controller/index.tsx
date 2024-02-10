import { FormInstance } from 'antd'
import AxiosController from '../../../utils/axios.controller'
import { AxiosError } from 'axios'

const axios = new AxiosController()

export function UserFormController(formProp: FormPropType, form: FormInstance<UserData>) {
  return {
    onFinish: async (values: UserData) => {
      console.log('Received values of form: ', values)
      formProp.setFormProp?.({
        ...formProp,
        shouldSubmit: false,
        status: 'loading',
      })
      const res = await axios.createUser(values)
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
