import { useContext, useEffect, useState } from 'react'
import { FormController } from './controller'
import { Button, Divider, Empty, Form, Input, InputNumber } from 'antd'
import LabPatientForm from './items/LabPatientForm'
import HemotologyForm from './items/HematologyForm'
import LiverProfileForm from './items/LiverProfileForm'
import CardiacProfileForm from './items/CardiacProfileForm'
import KidneyProfileForm from './items/KidneyProfileForm'
import InfectiveProfileForm from './items/InfectiveProfileForm'
import * as refactors from './EditableTable/utils/refactors'
import CatheterForm from './items/CatheterProfileForm'
import useStretchers from '../../hooks/useStretchers'
import DiagnosticForm from './items/DiagnosticForm'
import formItemLayout from './constants/formLayout'
import GasometricForm from './items/GasometricForm'
import EditableTable from './EditableTable'
import FickForm from './items/FickProfileForm'
import useMsgApi from '../../hooks/useMsgApi'
import { AxiosError } from 'axios'
import './style.css'
import StretcherConfing from './items/StretcherProfileForm'
import { StretcherDataContext } from '../../contexts/StretcherDataProvider'

interface FormProps {
  formProp: FormPropType
  data?: LaboratoryData | PatientData | StretcherData
  onFieldsChange?: () => void
  onCancel?: () => void
}

export default function CustomForm(children: React.ReactNode) {
  return <>{children}</>
}

CustomForm.User = function UserForm({ formProp }: FormProps) {
  const [form] = Form.useForm<UserData>()
  const { onFinish, onFinishFailed } = FormController(
    {
      formType: 'user',
      formProp,
    },
    () => {
      form.resetFields()
      formProp.handleUpdate?.(true)
    }
  )

  useEffect(() => {
    if (formProp.shouldSubmit && formProp.status === 'initial') {
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
  const freeStretchers = useStretchers()?.filter(
    (stretcher) => !stretcher.patientId
  )
  const { onFinish, onFinishFailed } = FormController(
    {
      formType: 'patient',
      formProp,
    },
    () => {
      form.resetFields()
      formProp.handleUpdate?.(true)
    }
  )

  const handleSubmit = (values: unknown) => {
    const patient = (values as { patientId: PatientData }).patientId
    patient.stretcherId = patient.stretcherId || null
    onFinish(patient)
  }

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
      name="patientForm"
      onFinish={handleSubmit}
      onFinishFailed={onFinishFailed}
      className="form-component"
      initialValues={{
        patientId: {
          stretcherId: '',
        },
      }}
      scrollToFirstError
    >
      <LabPatientForm
        showTitle={false}
        freeStretchers={freeStretchers}
        form={form}
      />
    </Form>
  )
}

CustomForm.EditPatient = function PatientForm(props: FormProps) {
  const { formProp, data, onFieldsChange, onCancel } = props
  const msgApi = useMsgApi()
  const [form] = Form.useForm<PatientData>()
  const patientData = { ...(data as PatientData) }
  const stretchers = useStretchers()
  const freeStretchers =
    stretchers?.filter((stretcher) => !stretcher.patientId) ?? []
  const { onFinish, onFinishFailed } = FormController(
    {
      formType: 'update-patient',
      formProp,
    },
    () => formProp.handleUpdate?.(true)
  )
  let label: string | undefined | null
  if (!patientData.stretcherId) {
    patientData.stretcherId = ''
  } else {
    label = stretchers?.find(
      (stretcher) => stretcher._id === patientData.stretcherId
    )?.label
    if (label) patientData.stretcherId = label
  }

  const handleSubmit = (values: unknown) => {
    const patient = (values as { patientId: PatientData }).patientId
    patient.stretcherId = patient.stretcherId || null
    if (patient.stretcherId === label)
      patient.stretcherId = (data as PatientData).stretcherId
    patient._id = data!._id
    onFinish(patient)
  }

  useEffect(() => {
    if (formProp.shouldSubmit && formProp.status === 'initial') {
      console.log('submitting form')
      form.submit()
    }
  }, [formProp, form])

  useEffect(() => {
    if (formProp.shouldSubmit) return

    if (formProp.status === 'ok') {
      msgApi.success('Paciente editado con éxito.')
      formProp.setFormProp!({ ...formProp, status: 'initial', message: null })
    } else if (formProp.status === 'form-error') {
      msgApi.warning(formProp.message)
      formProp.setFormProp!({ ...formProp, status: 'initial', message: null })
    } else if (formProp.status === 'server-error') {
      msgApi.error(formProp.message)
      formProp.setFormProp!({ ...formProp, status: 'initial', message: null })
    }
  }, [formProp, msgApi])

  useEffect(() => {
    if (onCancel) {
      form.resetFields()
      onCancel()
    }
  }, [onCancel, form])

  return (
    <Form
      {...formItemLayout}
      form={form}
      name={data?._id}
      onFinish={handleSubmit}
      onFinishFailed={onFinishFailed}
      className="form-component"
      initialValues={{
        patientId: patientData,
      }}
      onFieldsChange={() => {
        if (onFieldsChange) onFieldsChange()
      }}
      scrollToFirstError
    >
      <LabPatientForm
        showTitle={false}
        freeStretchers={freeStretchers}
        form={form}
      />
    </Form>
  )
}

CustomForm.Laboratory = function LabForm({ formProp, data }: FormProps) {
  const msgApi = useMsgApi()
  const [form] = Form.useForm<LaboratoryData>()
  const [isLoading, setIsLoading] = useState(false)
  const { onFinish: onFinishLab, onFinishFailed } = FormController(
    {
      formType: 'lab',
      formProp,
    },
    () => setIsLoading(false)
  )
  const { onFinish: onFinishPatient } = FormController(
    {
      formType: 'update-patient',
      execSetFormProp: false,
      formProp,
    },
    (res) => {
      if (res instanceof AxiosError) {
        msgApi.error('Error al actualizar la información del paciente.')
      } else {
        msgApi.success('Información del paciente actualizada con éxito.')
      }
    }
  )

  const handleSubmit = (values: LaboratoryData) => {
    const lab: Partial<LaboratoryData> = JSON.parse(JSON.stringify(values))
    delete lab.patientId
    lab._id = data!._id

    const patient = values.patientId as PatientData
    patient._id = (data as { patientId: PatientData }).patientId._id

    setIsLoading(true)
    onFinishLab(lab as LaboratoryData)
    onFinishPatient(patient)
  }

  useEffect(() => {
    if (formProp.shouldSubmit && formProp.status === 'initial') {
      form.submit()
    }
  }, [formProp, form])

  useEffect(() => {
    setTimeout(() => {
      form.setFieldsValue(data as LaboratoryData)
    }, 0)
  }, [data, form])

  if (!data) return <Empty />

  return (
    <Form
      {...formItemLayout}
      form={form}
      name="labForm"
      onFinish={handleSubmit}
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
      <InfectiveProfileForm form={form} isEnabled={formProp.enable} />
      <Divider />
      <KidneyProfileForm />
      <Divider />
      <DiagnosticForm form={form} isEnabled={formProp.enable} />
      <div className="submit-container">
        <Button type="primary" htmlType="submit" loading={isLoading}>
          Guardar registro
        </Button>
      </div>
    </Form>
  )
}

CustomForm.Stretchers = function StretcherForm({ formProp, data }: FormProps) {
  const msgApi = useMsgApi()
  const stretcherInfo = data as StretcherData
  const patientInfo = stretcherInfo.patientId as PatientData
  const [form] = Form.useForm<StretcherData>()
  const [isLoading, setIsLoading] = useState(false)
  const { updateStretchers } = useContext(StretcherDataContext)
  const [tableValues, setTableValues] = useState(
    refactors.suppliedToTableValuesType(stretcherInfo.suministros.drogas)
  )
  const { onFinish, onFinishFailed } = FormController({
    formType: 'update-stretcher',
    formProp,
  }, () => {
    setIsLoading(false)
    msgApi.open({
      type: 'loading',
      content: 'Actualizando repositorio...',
      key: 'update-stretcher',
      duration: 0
    })
    updateStretchers().finally(() => msgApi.destroy('update-stretcher'))
  })
  const ascValue = ((patientInfo.weight * patientInfo.height) / 3600).toFixed(2)

  const handleSubmit = (values: Partial<StretcherData>) => {
    delete values.patientId
    const suppliedData = refactors.tableValuesAsSupplied(tableValues)
    if (suppliedData instanceof Promise) {
      suppliedData.catch((err) => msgApi.warning(err))
      return
    }
    values.suministros = { drogas: suppliedData }
    values._id = stretcherInfo._id
    setIsLoading(true)
    onFinish(values as StretcherData)
  }

  useEffect(() => {
    setTimeout(() => {
      form.setFieldsValue(data as LaboratoryData)
    }, 0)
  }, [data, form])

  return (
    <Form
      {...formItemLayout}
      form={form}
      name="stretcherForm"
      onFinish={handleSubmit}
      onFinishFailed={onFinishFailed}
      className="form-component"
      scrollToFirstError
      initialValues={{ ...stretcherInfo, patientId: stretcherInfo!.patientId }}
    >
      <StretcherConfing />
      <Divider />
      <LabPatientForm form={form} />
      <>
        <Form.Item label="ASC">
          <InputNumber value={ascValue} disabled />
        </Form.Item>
        <Form.Item name="patientHeartRate" label="Frecuencia Cardíaca">
          <InputNumber />
        </Form.Item>
      </>
      <Divider />
      <GasometricForm form={form} />
      <Divider />
      <FickForm form={form} />
      <Divider />
      <CatheterForm />
      <Divider />
      <EditableTable dataSource={tableValues} setDataSource={setTableValues} />
      <div className="submit-container">
        <Button
          type="primary"
          htmlType="submit"
          loading={isLoading}
        >
          Guardar registro
        </Button>
      </div>
    </Form>
  )
}
