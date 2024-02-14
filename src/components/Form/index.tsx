import { UserFormController } from './controller'
import { Form, Input } from 'antd'
import { useEffect } from 'react'
import './style.css'

interface FormProps {
  formProp: FormPropType
}

export default function CustomForm(children: React.ReactNode) {
  return <>{children}</>
}

CustomForm.User = function UserForm({ formProp }: FormProps) {
  const [form] = Form.useForm<UserData>()
  const { onFinish, onFinishFailed, formItemLayout } = UserFormController(
    formProp,
    form
  )

  useEffect(() => {
    if (formProp.shouldSubmit && formProp.status === 'initial') {
      console.log('submitting form')
      form.submit()
    }
  }, [formProp, form])

  return (
    <Form
      {...formItemLayout}
      form={form}
      name="userForm"
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      scrollToFirstError
      className='form-component'
    >
      <Form.Item
        name="name"
        label="Nombre"
        rules={[
          {
            required: true,
            message: 'Por favor ingrese un nombre',
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="lastName"
        label="Apellido"
        rules={[
          {
            required: true,
            message: 'Por favor ingrese un apellido',
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="username"
        label="Usuario"
        tooltip="Es el nombre que usará el usuario para iniciar sesión en la plataforma."
        rules={[
          {
            required: true,
            message: 'Por favor ingrese un nombre de usuario',
            whitespace: true,
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="password"
        label="Password"
        rules={[
          {
            required: true,
            message: 'Por favor ingrese una contraseña',
          },
        ]}
        hasFeedback
      >
        <Input.Password />
      </Form.Item>

      <Form.Item
        name="confirm"
        label="Confirmar Password"
        dependencies={['password']}
        hasFeedback
        rules={[
          {
            required: true,
            message: 'Por favor confirme la contraseña',
          },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue('password') === value) {
                return Promise.resolve()
              }
              return Promise.reject(
                new Error('Las dos contraseñas que ingresaste no coinciden')
              )
            },
          }),
        ]}
      >
        <Input.Password />
      </Form.Item>
    </Form>
  )
}
