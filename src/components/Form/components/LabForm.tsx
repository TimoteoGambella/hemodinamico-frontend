import InfectiveProfileForm from '../items/InfectiveProfileForm'
import CardiacProfileForm from '../items/CardiacProfileForm'
import * as refactor from '../EditableTable/utils/refactors'
import KidneyProfileForm from '../items/KidneyProfileForm'
import useUpdateRepo from '../../../hooks/useUpdateRepo'
import LiverProfileForm from '../items/LiverProfileForm'
import LabPatientForm from '../items/LabPatientForm'
import HemotologyForm from '../items/HematologyForm'
import DiagnosticForm from '../items/DiagnosticForm'
import { Button, Divider, Empty, Form } from 'antd'
import formLayout from '../constants/formLayout'
import useMsgApi from '../../../hooks/useMsgApi'
import { FormController } from '../controller'
import { useState, useEffect } from 'react'
import { CustomFormProps } from '..'
import { AxiosError } from 'axios'

export default function LabForm({ formProp, data }: CustomFormProps) {
  const msgApi = useMsgApi()
  const updateRepo = useUpdateRepo()
  const [form] = Form.useForm<LaboratoryData>()
  const [isLoading, setIsLoading] = useState(false)
  const [cultivos, setCultivos] = useState<CultivoFormType[]>([])
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
    lab.infective!.cultivos = refactor.cultivoFormToCultivo(cultivos)

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
    if (!data) return
    const labData = JSON.parse(JSON.stringify(data)) as LaboratoryData
    const cultivos = refactor.cultivoToCultivoForm(
      labData.infective.cultivos || []
    )
    setCultivos(cultivos)
  }, [data, setCultivos])

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
      {...formLayout}
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
      <InfectiveProfileForm
        form={form}
        isEnabled={formProp.enable}
        cultivos={cultivos}
        setCultivos={setCultivos}
      />
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
