import useUpdateStretchers from '../../../hooks/useUpdateStretcher'
import useUpdatePatients from '../../../hooks/useUpdatePatients'
import useStretchers from '../../../hooks/useStretchers'
import LabPatientForm from '../items/LabPatientForm'
import useMsgApi from '../../../hooks/useMsgApi'
import formLayout from '../constants/formLayout'
import { FormController } from '../controller'
import { CustomFormProps } from '..'
import { AxiosError } from 'axios'
import { useEffect } from 'react'
import { Form } from 'antd'

export default function PatientForm({ formProp }: CustomFormProps) {
  const msgApi = useMsgApi()
  const [form] = Form.useForm<PatientData>()
  const updatePatients = useUpdatePatients()
  const updateStretchers = useUpdateStretchers()
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
      form.submit()
    }
  }, [formProp, form])

  return (
    <Form
      {...formLayout}
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
