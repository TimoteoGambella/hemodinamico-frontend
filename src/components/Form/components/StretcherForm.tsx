import { validateTableSuppliedValues } from '../EditableTable/utils/refactors'
import StretcherDiagnostic from '../items/StretcherDiagnostic'
import StretcherConfing from '../items/StretcherConfigForm'
import CalculedVariables from '../items/CalculedVariables'
import { Button, Divider, Form, InputNumber } from 'antd'
import useUpdateRepo from '../../../hooks/useUpdateRepo'
import CatheterForm from '../items/CatheterProfileForm'
import GasometricForm from '../items/GasometricForm'
import LabPatientForm from '../items/LabPatientForm'
import useMsgApi from '../../../hooks/useMsgApi'
import { calcASCValue } from '../utils/formulas'
import formLayout from '../constants/formLayout'
import FickForm from '../items/FickProfileForm'
import { FormController } from '../controller'
import EditableTable from '../EditableTable'
import { useState, useEffect } from 'react'
import { CustomFormProps } from '..'
import { AxiosError } from 'axios'

export default function StretcherForm({ formProp, data }: CustomFormProps) {
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
      {...formLayout}
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
      <EditableTable.Stretcher
        data={tableValues}
        setDataSource={setTableValues}
      />
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
