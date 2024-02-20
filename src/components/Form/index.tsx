import {
  FormController,
  getStretchers,
  validateInputNumber,
} from './controller'
import { Empty, Form, Input, InputNumber, Select } from 'antd'
import { useEffect, useState } from 'react'
import useMsgApi from '../../hooks/useMsgApi'
import './style.css'

interface FormProps {
  formProp: FormPropType
  data?:
    | PatientData
    | Hematology
    | LiverProfile
    | CardiacProfile
    | Infective
    | Kidney
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

CustomForm.LabPatient = function LabPatientForm({ formProp, data }: FormProps) {
  const msgApi = useMsgApi()
  const [form] = Form.useForm<PatientData>()
  const patient = data as PatientData
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

  useEffect(() => {
    if (!patient) {
      msgApi.error('Error al cargar el paciente. Inténtelo de nuevo más tarde.')
    }
  }, [patient, msgApi])

  if (!patient) return <Empty />

  return (
    <Form
      {...formItemLayout}
      form={form}
      name="labPatientForm"
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      className="form-component fix-form"
      initialValues={{
        dni: patient.dni,
        fullname: patient.fullname,
        gender: patient.gender,
        age: patient.age,
        height: patient.height,
        weight: patient.weight,
        bloodType: patient.bloodType,
      }}
      scrollToFirstError
      disabled={!formProp.enable}
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
        <Select>
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
        label="Grupo sanguíneo"
        name="bloodType"
        rules={[
          {
            required: true,
            message: 'Por favor seleccione el grupo sanguíneo del paciente.',
          },
        ]}
      >
        <Select>
          <Select.Option value="a+">A+</Select.Option>
          <Select.Option value="a-">A-</Select.Option>
          <Select.Option value="b+">B+</Select.Option>
          <Select.Option value="b-">B-</Select.Option>
          <Select.Option value="ab+">AB+</Select.Option>
          <Select.Option value="ab">AB-</Select.Option>
          <Select.Option value="o+">O+</Select.Option>
          <Select.Option value="o-">O-</Select.Option>
        </Select>
      </Form.Item>
    </Form>
  )
}

CustomForm.LabHema = function LabHemaForm({ formProp, data }: FormProps) {
  const msgApi = useMsgApi()
  const [form] = Form.useForm<Hematology>()
  const hematology = data as Hematology
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

  useEffect(() => {
    if (!data) {
      msgApi.error(
        'Error al cargar la información de hematología. Inténtelo de nuevo más tarde.'
      )
    }
  }, [data, msgApi])

  if (!data) return <Empty />

  return (
    <Form
      {...formItemLayout}
      form={form}
      name="labHemaForm"
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      className="form-component fix-form"
      initialValues={{
        hemoglobina: hematology.hemoglobina,
        segmentados: hematology.segmentados,
        protrombina: hematology.protrombina,
        leucocitos: hematology.leucocitos,
        plaquetas: hematology.plaquetas,
        bastones: hematology.bastones,
        INR: hematology.INR,
        TPA: hematology.TPA,
      }}
      scrollToFirstError
      disabled={!formProp.enable}
    >
      <Form.Item
        name="hemoglobina"
        label="Hemoglobina (g/dL)"
        rules={[
          {
            required: true,
            message: 'Por favor ingrese el valor de hemoglobina del paciente',
          },
        ]}
      >
        <InputNumber step={0.1} />
      </Form.Item>
      <Form.Item
        name="plaquetas"
        label="Plaquetas (10³ x mm³)"
        rules={[
          {
            required: true,
            message: 'Por favor ingrese el valor de plaquetas del paciente',
          },
        ]}
      >
        <InputNumber step={0.1} />
      </Form.Item>

      <Form.Item
        name="leucocitos"
        label="Leucocitos (10³ x mm³)"
        rules={[
          {
            required: true,
            message: 'Por favor ingrese el valor de leucocitos del paciente',
          },
        ]}
      >
        <InputNumber step={0.1} />
      </Form.Item>

      <Form.Item
        name="bastones"
        label="Bastones (%)"
        rules={[
          {
            required: true,
            message: 'Por favor ingrese el valor de bastones del paciente',
          },
        ]}
      >
        <InputNumber step={0.1} />
      </Form.Item>

      <Form.Item
        name="segmentados"
        label="Segmentados (%)"
        rules={[
          {
            required: true,
            type: 'number',
            message: 'Por favor ingrese el valor de segmentados del paciente',
          },
        ]}
      >
        <InputNumber step={0.1} />
      </Form.Item>

      <Form.Item
        name="INR"
        label="I.N.R"
        rules={[
          {
            required: true,
            type: 'number',
            message: 'Por favor ingrese el valor de INR del paciente',
          },
        ]}
      >
        <InputNumber step={0.1} />
      </Form.Item>

      <Form.Item
        name="protrombina"
        label="T. Protrombina (Seg)"
        rules={[
          {
            required: true,
            type: 'number',
            message: 'Por favor ingrese el valor de protrombina del paciente',
          },
        ]}
      >
        <InputNumber step={0.1} />
      </Form.Item>

      <Form.Item
        name="TPA"
        label="T. TPA (seg)"
        rules={[
          {
            required: true,
            type: 'number',
            message: 'Por favor ingrese el valor de TPA del paciente',
          },
        ]}
      >
        <InputNumber step={0.1} />
      </Form.Item>
    </Form>
  )
}

CustomForm.LabLiver = function LabLiverForm({ formProp, data }: FormProps) {
  const msgApi = useMsgApi()
  const [form] = Form.useForm<LiverProfile>()
  const liver = data as LiverProfile
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

  useEffect(() => {
    if (!data) {
      msgApi.error(
        'Error al cargar la información de perfil hepático. Inténtelo de nuevo más tarde.'
      )
    }
  }, [data, msgApi])

  if (!data) return <Empty />

  return (
    <Form
      {...formItemLayout}
      form={form}
      name="labLiverForm"
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      className="form-component fix-form"
      initialValues={{
        TGO: liver.TGO,
        TGP: liver.TGP,
        albumina: liver.albumina,
        fosfatasa: liver.fosfatasa,
        bilirrubina: liver.bilirrubina,
      }}
      scrollToFirstError
      disabled={!formProp.enable}
    >
      <Form.Item
        name="TGO"
        label="TGO (U/L)"
        rules={[
          {
            required: true,
            message: 'Por favor ingrese el valor de TGO del paciente',
          },
        ]}
      >
        <InputNumber step={0.1} />
      </Form.Item>

      <Form.Item
        name="TGP"
        label="TGP (U/L)"
        rules={[
          {
            required: true,
            message: 'Por favor ingrese el valor de TGP del paciente',
          },
        ]}
      >
        <InputNumber step={0.1} />
      </Form.Item>

      <Form.Item
        name="albumina"
        label="Albumina (g/dL)"
        rules={[
          {
            required: true,
            message: 'Por favor ingrese el valor de albumina del paciente',
          },
        ]}
      >
        <InputNumber step={0.1} />
      </Form.Item>

      <Form.Item
        name={['bilirrubina', 'total']}
        label="Bilirrubina total (mg/dL)"
        rules={[
          {
            required: true,
            message:
              'Por favor ingrese el valor de bilirrubina total del paciente',
          },
        ]}
      >
        <InputNumber step={0.1} />
      </Form.Item>

      <Form.Item
        name={['bilirrubina', 'directa']}
        label="B. directa (mg/dL)"
        rules={[
          {
            required: true,
            type: 'number',
            message:
              'Por favor ingrese el valor de bilirrubina directa del paciente',
          },
        ]}
      >
        <InputNumber step={0.1} />
      </Form.Item>

      <Form.Item
        shouldUpdate
        label="B. indirecta (mg/dL)"
      >
        {() => {
          return (
            <Input
              value={
                Number(form.getFieldValue(['bilirrubina', 'total']) -
                form.getFieldValue(['bilirrubina', 'directa'])).toFixed(2)
              }
              readOnly
            />
          )
        }}
      </Form.Item>

      <Form.Item
        name="fosfatasa"
        label="Foafatasa alcalina (U/L)"
        rules={[
          {
            required: true,
            type: 'number',
            message:
              'Por favor ingrese el valor de fosfatasa alcalina del paciente',
          },
        ]}
      >
        <InputNumber step={0.1} />
      </Form.Item>
    </Form>
  )
}

CustomForm.LabCardiac = function LabCardiacForm({ formProp, data }: FormProps) {
  const msgApi = useMsgApi()
  const [form] = Form.useForm<CardiacProfile>()
  const cardiac = data as CardiacProfile
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

  useEffect(() => {
    if (!data) {
      msgApi.error(
        'Error al cargar la información de perfil cardiaco. Inténtelo de nuevo más tarde.'
      )
    }
  }, [data, msgApi])

  if (!data) return <Empty />

  return (
    <Form
      {...formItemLayout}
      form={form}
      name="labCardiactForm"
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      className="form-component fix-form"
      initialValues={{
        troponina: cardiac.troponina,
        CPK: cardiac.CPK,
        PRO: cardiac.PRO,
        CA125: cardiac.CA125,
      }}
      scrollToFirstError
      disabled={!formProp.enable}
    >
      <Form.Item
        name="troponina"
        label="Troponina T (ng/mL)"
        rules={[
          {
            required: true,
            message: 'Por favor ingrese el valor de troponina T del paciente',
          },
        ]}
      >
        <InputNumber step={0.1} />
      </Form.Item>

      <Form.Item
        name="CPK"
        label="CPK-MB (U/L)"
        rules={[
          {
            required: true,
            message: 'Por favor ingrese el valor de CPK-MB del paciente',
          },
        ]}
      >
        <InputNumber step={0.1} />
      </Form.Item>

      <Form.Item
        name="PRO"
        label="PRO-BNP"
        rules={[
          {
            required: true,
            message: 'Por favor ingrese el valor de PRO-BNP del paciente',
          },
        ]}
      >
        <InputNumber step={0.1} />
      </Form.Item>

      <Form.Item
        name="CA125"
        label="CA-125"
        rules={[
          {
            required: true,
            message: 'Por favor ingrese el valor de CA-125 del paciente',
          },
        ]}
      >
        <InputNumber step={0.1} />
      </Form.Item>
    </Form>
  )
}

CustomForm.LabInfec = function LabInfectiveForm({ formProp, data }: FormProps) {
  const msgApi = useMsgApi()
  const [form] = Form.useForm<Infective>()
  const infective = data as Infective
  const [result, setResult] = useState<boolean>(infective.resultado ?? false)
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

  useEffect(() => {
    if (!data) {
      msgApi.error(
        'Error al cargar la información de infecciones. Inténtelo de nuevo más tarde.'
      )
    }
  }, [data, msgApi])

  if (!data) return <Empty />

  return (
    <Form
      {...formItemLayout}
      form={form}
      name="labInfectiveForm"
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      className="form-component fix-form"
      initialValues={{
        proteinaC: infective.proteinaC,
        procalcitonina: infective.procalcitonina,
        cultivo: infective.cultivo,
        resultado: infective.resultado,
        germen: infective.germen,
      }}
      scrollToFirstError
      disabled={!formProp.enable}
    >
      <Form.Item
        name="proteinaC"
        label="Protetina C reactiva"
        rules={[
          {
            required: true,
            message:
              'Por favor ingrese el valor de proteína C reactiva del paciente',
          },
        ]}
      >
        <InputNumber step={0.1} />
      </Form.Item>

      <Form.Item
        name="procalcitonina"
        label="Procalcitonina"
        rules={[
          {
            required: true,
            message:
              'Por favor ingrese el valor de procalcitonina del paciente',
          },
        ]}
      >
        <InputNumber step={0.1} />
      </Form.Item>

      <Form.Item
        name="cultivo"
        label="Cultivo"
        rules={[
          {
            required: true,
            message: 'Por favor seleccione el tipo de cultivo del paciente',
          },
        ]}
      >
        <Select placeholder="Seleccionar">
          <Select.Option value="hemocultivo">Hemocultivo</Select.Option>
          <Select.Option value="urocultivo">Urocultivo</Select.Option>
          <Select.Option value="cultivo de secreción">
            Cultivo de secreción
          </Select.Option>
        </Select>
      </Form.Item>

      <Form.Item
        name="resultado"
        label="Resultado del cultivo"
        rules={[
          {
            required: true,
            message:
              'Por favor seleccione el resultado del cultivo del paciente',
          },
        ]}
      >
        <Select
          placeholder="Seleccionar"
          onChange={(e) => setResult(e === 'true')}
        >
          <Select.Option value="true">POSITIVO</Select.Option>
          <Select.Option value="false">NEGATIVO</Select.Option>
        </Select>
      </Form.Item>

      <Form.Item
        name="germen"
        label="Germen"
        rules={[
          {
            required: result,
            message: 'Por favor ingrese el valor de CA-125 del paciente',
          },
        ]}
      >
        <Input disabled={!result} />
      </Form.Item>
    </Form>
  )
}

CustomForm.LabKidney = function LabKidneyForm({ formProp, data }: FormProps) {
  const msgApi = useMsgApi()
  const [form] = Form.useForm<Kidney>()
  const kidney = data as Kidney
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

  useEffect(() => {
    if (!data) {
      msgApi.error(
        'Error al cargar la información renal. Inténtelo de nuevo más tarde.'
      )
    }
  }, [data, msgApi])

  if (!data) return <Empty />

  return (
    <Form
      {...formItemLayout}
      form={form}
      name="labKidneyForm"
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      className="form-component fix-form"
      initialValues={{
        creatinina: kidney.creatinina,
        urea: kidney.urea,
        TFG: kidney.TFG,
      }}
      scrollToFirstError
      disabled={!formProp.enable}
    >
      <Form.Item
        name="urea"
        label="Urea (mg/dL)"
        rules={[
          {
            required: true,
            message: 'Por favor ingrese el valor de urea del paciente en mg/dL',
          },
        ]}
      >
        <InputNumber step={0.1} />
      </Form.Item>

      <Form.Item
        name="creatinina"
        label="Creatinina (mg/dL)"
        rules={[
          {
            required: true,
            message:
              'Por favor ingrese el valor de creatinina del paciente en mg/dL',
          },
        ]}
      >
        <InputNumber step={0.1} />
      </Form.Item>

      <Form.Item
        name="TFG"
        label="T.F.G (C-G)"
        rules={[
          {
            required: true,
            message: 'Por favor ingrese el valor de TFG del paciente',
          },
        ]}
      >
        <Input readOnly />
      </Form.Item>
    </Form>
  )
}
