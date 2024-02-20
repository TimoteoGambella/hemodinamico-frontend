import {
  FormController,
  getStretchers,
  validateInputNumber,
} from './controller'
import {
  Button,
  Divider,
  Empty,
  Form,
  Input,
  InputNumber,
  Select,
} from 'antd'
import { useEffect, useState } from 'react'
import LabPatientForm from './items/LabPatientForm'
import HemotologyForm from './items/HematologyForm'
import LiverProfileForm from './items/LiverProfileForm'
import CardiacProfileForm from './items/CardiacProfileForm'
import KidneyProfileForm from './items/KidneyProfileForm'
import InfectiveProfileForm from './items/InfectiveProfileForm'
import './style.css'

interface FormProps {
  formProp: FormPropType
  data?: LaboratoryData
}

export default function CustomForm(children: React.ReactNode) {
  return <>{children}</>
}

CustomForm.User = function UserForm({ formProp }: FormProps) {
  const [form] = Form.useForm<UserData>()
  const { onFinish, onFinishFailed, formItemLayout } = FormController({
    formType: 'user',
    formProp,
    form,
  })

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
      className="form-component"
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

CustomForm.Patients = function PatientForm({ formProp }: FormProps) {
  const [form] = Form.useForm<PatientData>()
  const [selectedStretcher, setSelectedStretcher] = useState('1')
  const [freeStretchers, setStretchers] = useState<StretcherData[]>([])
  const { onFinish, onFinishFailed, formItemLayout } = FormController({
    formType: 'patient',
    formProp,
    form,
  })
  const tooltipProp =
    selectedStretcher === '1'
      ? {
          tooltip:
            'El valor automático le asigna una camilla disponible al paciente o creará una.',
        }
      : {}

  useEffect(() => {
    if (formProp.shouldSubmit && formProp.status === 'initial') {
      console.log('submitting form')
      form.submit()
    }
  }, [formProp, form])

  useEffect(() => {
    getStretchers().then((res) => {
      if (res) setStretchers(res)
      else
        formProp.setFormProp?.({
          ...formProp,
          status: 'server-error',
          message: 'Error al obtener las camillas',
        })
    })
  }, [selectedStretcher, formProp])

  return (
    <Form
      {...formItemLayout}
      form={form}
      name="patientForm"
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      className="form-component"
      initialValues={{
        stretcherId: 'auto',
      }}
      scrollToFirstError
    >
      <Form.Item
        name="fullname"
        label="Nombre completo"
        rules={[
          {
            required: true,
            message: 'Por favor ingrese el nombre del paciente',
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="dni"
        label="DNI"
        rules={[
          {
            required: true,
            message: 'Por favor ingrese el DNI del paciente',
          },
          () => ({
            validator(_rule, value) {
              if (!value) return Promise.reject()
              if (value && value.toString().length === 8) {
                return Promise.resolve()
              } else {
                return Promise.reject('El DNI debe tener 8 dígitos')
              }
            },
          }),
        ]}
      >
        <Input maxLength={8} onInput={validateInputNumber} />
      </Form.Item>

      <Form.Item
        name="gender"
        label="Sexo"
        rules={[
          {
            required: true,
            message: 'Por favor seleccione el sexo del paciente',
          },
        ]}
      >
        <Select placeholder="Seleccionar">
          <Select.Option value="M">Masculino</Select.Option>
          <Select.Option value="F">Femenino</Select.Option>
        </Select>
      </Form.Item>

      <Form.Item
        name="age"
        label="Edad"
        rules={[
          {
            required: true,
            message: 'Por favor ingrese la edad del paciente',
          },
        ]}
      >
        <Input maxLength={3} onInput={validateInputNumber} />
      </Form.Item>

      <Form.Item
        name="height"
        label="Talla (cm)"
        rules={[
          {
            required: true,
            type: 'number',
            message: 'Por favor ingrese la talla del paciente',
          },
        ]}
      >
        <InputNumber step={0.1} />
      </Form.Item>

      <Form.Item
        name="weight"
        label="Peso (kg)"
        rules={[
          {
            required: true,
            type: 'number',
            message: 'Por favor ingrese el peso del paciente',
          },
        ]}
      >
        <InputNumber step={0.1} />
      </Form.Item>

      <Form.Item
        name="stretcherId"
        label="Camilla"
        {...tooltipProp}
        rules={[
          {
            required: true,
            message: 'Por favor selecione una camilla para el paciente',
          },
        ]}
      >
        <Select onChange={(e) => setSelectedStretcher(e)}>
          <Select.Option value="auto">Automático</Select.Option>
          {freeStretchers.map((stretcher) => {
            if (stretcher.patientId) return null
            return (
              <Select.Option value={stretcher._id} key={stretcher._id}>
                {stretcher.label ?? stretcher._id}
              </Select.Option>
            )
          })}
        </Select>
      </Form.Item>
    </Form>
  )
}

CustomForm.Laboratory = function LabForm({ formProp, data }: FormProps) {
  const [form] = Form.useForm<Kidney>()
  const { onFinish, onFinishFailed, formItemLayout } = FormController({
    formType: 'patient',
    formProp,
    form,
  })

  useEffect(() => {
    if (formProp.shouldSubmit && formProp.status === 'initial') {
      console.log('submitting form')
      form.submit()
    }
  }, [formProp, form])

  if (!data) return <Empty />

  return (
    <Form
      {...formItemLayout}
      form={form}
      name="labForm"
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      className="form-component"
      initialValues={data}
      scrollToFirstError
      disabled={!formProp.enable}
    >
      <LabPatientForm />
      <Divider />
      <HemotologyForm />
      <Divider />
      <LiverProfileForm form={form} />
      <Divider />
      <CardiacProfileForm />
      <Divider />
      <InfectiveProfileForm form={form} />
      <Divider />
      <KidneyProfileForm />
      <div className='submit-container'>
        <Button>
          Guardar registro
        </Button>
      </div>
    </Form>
  )
}
