import { validateTableSuppliedValues } from '../EditableTable/utils/refactors'
import FormDirty, { removeUnusedProps } from '../../../utils/FormDirty'
import StretcherDiagnostic from '../items/StretcherDiagnostic'
import StretcherConfing from '../items/StretcherConfigForm'
import CalculedVariables from '../items/CalculedVariables'
import { Button, Divider, Form, FormInstance, InputNumber } from 'antd'
import useUpdateRepo from '../../../hooks/useUpdateRepo'
import CatheterForm from '../items/CatheterProfileForm'
import { calcASCValue } from '../../../utils/formulas'
import GasometricForm from '../items/GasometricForm'
import LabPatientForm from '../items/LabPatientForm'
import useMsgApi from '../../../hooks/useMsgApi'
import formLayout from '../constants/formLayout'
import FickForm from '../items/FickProfileForm'
import { FormController } from '../controller'
import EditableTable from '../EditableTable'
import { useState, useEffect } from 'react'
import { CustomFormProps } from '..'
import { AxiosError } from 'axios'

type CustomFormType = [
  FormInstance<StretcherData> & {
    customFields: {
      supplied: SuppliedDrugs[]
    }
  }
]

export default function StretcherForm({ formProp, data }: CustomFormProps) {
  const msgApi = useMsgApi()
  const updateRepo = useUpdateRepo()
  const stretcherInfo = JSON.parse(JSON.stringify(data)) as StretcherData
  const [form] = Form.useForm<StretcherData>() as unknown as CustomFormType
  const [isLoading, setIsLoading] = useState(false)
  const [initialValues] = useState({
    ...stretcherInfo,
    patientId: removeUnusedProps(
      {
        ...(stretcherInfo!.patientId as PatientData),
      },
      [
        '_id',
        'stretcherId',
        'laboratoryId',
        'createdAt',
        'isDeleted',
        'editedAt',
        'editedBy',
        '__v',
      ]
    ),
  })
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

  const dirty = new FormDirty(initialValues)

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

  const handleSubmit = async (values: Partial<StretcherData>) => {
    if (!(data as PopulatedStretcher)!.patientId) {
      msgApi.warning('No puedes editar una cama no asignada a un paciente.')
      return
    }
    /* PATIENT */
    const shouldUpdatePatient = dirty.isDirty(values, 'patientId')
    let patient: PatientData | undefined
    if (shouldUpdatePatient) {
      const patientId = stretcherInfo.patientId as PatientData
      patient = values.patientId as PatientData
      patient._id = patientId._id
      patient.stretcherId = patientId.stretcherId
    }
    /* LAB */
    delete values.patientId
    const suppliedData = validateTableSuppliedValues(
      form.customFields.supplied as DataSourceType[]
    )
    if (!suppliedData) {
      msgApi.warning(
        'Por favor complete la información de los suministros correctamente.'
      )
      return
    }
    if (values.diagnostic?.type === '') values.diagnostic.type = null
    values.suministros = { drogas: form.customFields.supplied }
    values._id = stretcherInfo._id
    setIsLoading(true)
    msgApi.open({
      type: 'loading',
      content: 'Actualizando laboratorio...',
      key: 'update-lab',
      duration: 0,
    })
    /* SEND REQUEST */
    try {
      await onFinish(values as StretcherData)
      if (patient) await onPatientFinish(patient)
      await updateRepo()
    } catch(error) {
      console.error(error)
    } finally {
      setIsLoading(false)
      msgApi.destroy('update-lab')
    }
  }

  useEffect(() => {
    setTimeout(() => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      form.setFieldsValue(stretcherInfo as any)
    }, 0)
  }, [form, stretcherInfo])

  if (!form.customFields && stretcherInfo) {
    form.customFields = {
      supplied: stretcherInfo.suministros.drogas,
    }
  }

  return (
    <Form
      {...formLayout}
      form={form}
      name="stretcherForm"
      onFinish={handleSubmit}
      onFinishFailed={onFinishFailed}
      className="form-component"
      initialValues={initialValues}
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
        <Form.Item
          name="patientHeartRate"
          label="Frecuencia Cardíaca"
          rules={[
            {
              required: true,
              message: 'Debe ingresar la frecuencia cardiaca del paciente',
            },
          ]}
        >
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
      <EditableTable.Stretcher form={form} />
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
