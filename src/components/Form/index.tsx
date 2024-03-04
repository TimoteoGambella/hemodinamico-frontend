import { useContext, useEffect, useState } from 'react'
import { FormController } from './controller'
import LabPatientForm from './items/LabPatientForm'
import HemotologyForm from './items/HematologyForm'
import LiverProfileForm from './items/LiverProfileForm'
import CardiacProfileForm from './items/CardiacProfileForm'
import KidneyProfileForm from './items/KidneyProfileForm'
import { Button, Divider, Empty, Form, Input, InputNumber } from 'antd'
import { validateTableSuppliedValues } from './EditableTable/utils/refactors'
import { StretcherDataContext } from '../../contexts/StretcherDataProvider'
import { PatientDataContext } from '../../contexts/PatientDataProvider'
import EditableTable, { DataSourceType } from './EditableTable'
import InfectiveProfileForm from './items/InfectiveProfileForm'
import StretcherDiagnostic from './items/StretcherDiagnostic'
import StretcherConfing from './items/StretcherConfigForm'
import CalculedVariables from './items/CalculedVariables'
import CatheterForm from './items/CatheterProfileForm'
import useStretchers from '../../hooks/useStretchers'
import useUpdateRepo from '../../hooks/useUpdateRepo'
import DiagnosticForm from './items/DiagnosticForm'
import formItemLayout from './constants/formLayout'
import GasometricForm from './items/GasometricForm'
import { calcASCValue } from './utils/formulas'
import FickForm from './items/FickProfileForm'
import useMsgApi from '../../hooks/useMsgApi'
import { AxiosError } from 'axios'
import './style.css'

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
  const msgApi = useMsgApi()
  const [form] = Form.useForm<PatientData>()
  const { updatePatients } = useContext(PatientDataContext)
  const { updateStretchers } = useContext(StretcherDataContext)
  const freeStretchers = useStretchers()?.filter(
    (stretcher) => !stretcher.patientId
  )
  const { onFinish, onFinishFailed } = FormController(
    {
      formType: 'patient',
      formProp,
    },
    (res) => {
      if (!(res instanceof AxiosError)) {
        form.resetFields()
        msgApi.open({
          type: 'loading',
          content: 'Actualizando repositorio...',
          duration: 0,
          key: 'update-patientForm-repo',
        })
        Promise.all([updatePatients(), updateStretchers()])
          .then(() => msgApi.success('Repositorio actualizado con éxito.', 4))
          .finally(() => msgApi.destroy('update-patientForm-repo'))
      }
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
  const updateRepo = useUpdateRepo()
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
    () => updateRepo()
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
  const updateRepo = useUpdateRepo()
  const [form] = Form.useForm<LaboratoryData>()
  const [isLoading, setIsLoading] = useState(false)
  const { onFinish: onFinishLab, onFinishFailed } = FormController(
    {
      formType: 'lab',
      formProp,
    },
    (res) => {
      setIsLoading(false)
      msgApi.destroy('lab-form')
      if (res instanceof AxiosError) {
        msgApi.error('Error al actualizar la información del laboratorio.')
      } else {
        msgApi.success('Laboratorio actualizado con éxito.')
      }
    }
  )
  const { onFinish: onFinishPatient } = FormController(
    {
      formType: 'update-patient',
      execSetFormProp: false,
      formProp,
    },
    (res) => {
      msgApi.destroy('lab-patient-form')
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
    patient.stretcherId = (
      data as { patientId: PatientData }
    ).patientId.stretcherId

    setIsLoading(true)
    msgApi.open({
      type: 'loading',
      content: 'Actualizando paciente...',
      key: 'lab-patient-form',
      duration: 0,
    })
    msgApi.open({
      type: 'loading',
      content: 'Actualizando laboratorio...',
      key: 'lab-form',
      duration: 0,
    })
    Promise.all([
      onFinishLab(lab as LaboratoryData),
      onFinishPatient(patient),
    ]).finally(() => updateRepo())
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

  if (!data) return <Empty description="Sin datos" />

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
  const updateRepo = useUpdateRepo()
  const stretcherInfo = JSON.parse(JSON.stringify(data)) as StretcherData
  const [form] = Form.useForm<StretcherData>()
  const [isLoading, setIsLoading] = useState(false)
  const [tableValues, setTableValues] = useState(
    stretcherInfo.suministros.drogas
  )
  const { onFinish, onFinishFailed } = FormController(
    {
      formType: 'update-stretcher',
      formProp,
    },
    (res) => {
      setIsLoading(false)
      msgApi.destroy('update-lab')
      if (res instanceof AxiosError) {
        msgApi.error('Error al actualizar el laboratorio.')
      } else {
        msgApi.success('Laboratorio actualizado con éxito.')
      }
    }
  )
  const { onFinish: onPatientFinish } = FormController({
    formType: 'update-patient',
    formProp,
  })

  if (stretcherInfo && !stretcherInfo.diagnostic.type) {
    stretcherInfo.diagnostic.type = ''
  }

  const shouldUpdateASC = (
    curValues: IStretcherFormType,
    prevValues: IStretcherFormType
  ) => {
    const weight = curValues.patientId?.weight
    const height = curValues.patientId?.height
    return (
      weight !== prevValues.patientId?.weight ||
      height !== prevValues.patientId?.height
    )
  }

  const handleSubmit = (values: Partial<StretcherData>) => {
    /* PATIENT */
    const patientId = stretcherInfo.patientId as PatientData
    const patient = values.patientId as PatientData
    patient._id = patientId._id
    patient.stretcherId = patientId.stretcherId
    /* LAB */
    delete values.patientId
    const suppliedData = validateTableSuppliedValues(
      tableValues as DataSourceType[]
    )
    if (!suppliedData) {
      msgApi.warning(
        'Por favor complete la información de los suministros correctamente.'
      )
      return
    }
    if (values.diagnostic?.type === '') values.diagnostic.type = null
    values.suministros = { drogas: tableValues }
    values._id = stretcherInfo._id
    setIsLoading(true)
    msgApi.open({
      type: 'loading',
      content: 'Actualizando laboratorio...',
      key: 'update-lab',
      duration: 0,
    })
    /* SEND REQUEST */
    Promise.all([
      onFinish(values as StretcherData),
      onPatientFinish(patient),
    ]).finally(() => updateRepo())
  }

  useEffect(() => {
    setTimeout(() => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      form.setFieldsValue(stretcherInfo as any)
    }, 0)
  }, [form, stretcherInfo])

  return (
    <Form
      {...formItemLayout}
      form={form}
      name="stretcherForm"
      onFinish={handleSubmit}
      onFinishFailed={onFinishFailed}
      className="form-component"
      initialValues={{ ...stretcherInfo, patientId: stretcherInfo!.patientId }}
      disabled={!formProp.enable}
      scrollToFirstError
    >
      <StretcherConfing />
      <Divider />
      <LabPatientForm form={form} />
      <>
        <Form.Item label="ASC" shouldUpdate={shouldUpdateASC}>
          {() => {
            const height = form.getFieldValue(['patientId', 'height'])
            const weight = form.getFieldValue(['patientId', 'weight'])
            const value = calcASCValue(weight, height)
            return <InputNumber value={!isNaN(value) ? value : '-'} disabled />
          }}
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
      <CatheterForm form={form} />
      <Divider />
      <CalculedVariables form={form} />
      <Divider />
      <EditableTable data={tableValues} setDataSource={setTableValues} />
      <Divider />
      <StretcherDiagnostic form={form} />
      <div className="submit-container">
        <Button type="primary" htmlType="submit" loading={isLoading}>
          Guardar registro
        </Button>
      </div>
    </Form>
  )
}
