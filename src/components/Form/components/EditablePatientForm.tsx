import useUpdateRepo from '../../../hooks/useUpdateRepo'
import useStretchers from '../../../hooks/useStretchers'
import LabPatientForm from '../items/LabPatientForm'
import formLayout from '../constants/formLayout'
import useMsgApi from '../../../hooks/useMsgApi'
import { FormController } from '../controller'
import { CustomFormProps } from '..'
import { useEffect } from 'react'
import { Form } from 'antd'

export default function EditablePatientForm(props: CustomFormProps) {
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
      {...formLayout}
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
