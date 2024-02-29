import { Form, FormInstance, InputNumber, Typography } from 'antd'
import * as controller from '../controller/fickProfile.controller'
import * as util from '../utils'

interface FickFormProps {
  form: FormInstance
}

const FickForm = ({ form }: FickFormProps) => {
  const getCurrentFormValues = () => {
    const weight = form.getFieldValue(['patientId', 'weight'])
    const height = form.getFieldValue(['patientId', 'height'])
    const heartRate = form.getFieldValue(['patientHeartRate'])
    const hemoglobin = form.getFieldValue(['fick', 'hemoglobina'])
    const saturationAo = form.getFieldValue(['muestra', 'arteria', 'sat'])
    const saturationAp = form.getFieldValue(['muestra', 'vena', 'sat'])
    const age = form.getFieldValue(['patientId', 'age'])
    return {
      weight,
      height,
      heartRate,
      age,
      hemoglobin,
      arteria: {
        sat: saturationAo,
      },
      vena: {
        sat: saturationAp,
      },
    }
  }

  return (
    <>
      <Typography.Title level={4}>FICK INDIRECTO</Typography.Title>
      <Form.Item name={['fick', 'hemoglobina']} label="Hemoglobina">
        <InputNumber />
      </Form.Item>

      {/* DISABLED FIELDS */}

      <Form.Item
        label="Consumo de O2 (VO2)"
        shouldUpdate={controller.shouldUpdateConsumption}
      >
        {() => {
          const { weight, height, heartRate, age } = getCurrentFormValues()
          const value = util.calcO2Consumption(weight, height, age, heartRate)
          return <InputNumber value={!isNaN(value) ? value : '-'} disabled />
        }}
      </Form.Item>

      <Form.Item
        label="Diferencia A-V sistémica"
        shouldUpdate={controller.shouldUpdateDiff}
      >
        {() => {
          const { arteria, vena, hemoglobin } = getCurrentFormValues()
          const value = util.calcDiffSys(
            hemoglobin,
            vena.sat,
            arteria.sat,
            'down'
          )
          return <InputNumber value={!isNaN(value) ? value : '-'} disabled />
        }}
      </Form.Item>

      <Form.Item
        label="Contenido O2 en AP"
        shouldUpdate={controller.shouldUpdateAP}
      >
        {() => {
          const { hemoglobin, vena } = getCurrentFormValues()
          const value = util.calcO2Content(hemoglobin, vena.sat, 'down')
          return <InputNumber value={!isNaN(value) ? value : '-'} disabled />
        }}
      </Form.Item>

      <Form.Item
        label="Contenido O2 en Ao"
        shouldUpdate={controller.shouldUpdateAo}
      >
        {() => {
          const { hemoglobin, arteria } = getCurrentFormValues()
          const value = util.calcO2Content(hemoglobin, arteria.sat, 'up')
          return <InputNumber value={!isNaN(value) ? value : '-'} disabled />
        }}
      </Form.Item>

      <Form.Item
        label="Capacidad de Hb"
        shouldUpdate={controller.shouldUpdateHbCapacity}
      >
        {() => {
          const { hemoglobin } = getCurrentFormValues()
          const value = util.calcHbCapacity(hemoglobin, 'down')
          return <InputNumber value={!isNaN(value) ? value : '-'} disabled />
        }}
      </Form.Item>

      <Form.Item
        label="Gasto cardíaco"
        shouldUpdate={controller.shouldUpdateSpent}
      >
        {() => {
          const { weight, height, heartRate, age, hemoglobin, arteria, vena } =
            getCurrentFormValues()
          const value = util.calcCardiacOutput(
            weight,
            height,
            age,
            heartRate,
            hemoglobin,
            vena.sat,
            arteria.sat,
            'down'
          )
          return <InputNumber value={!isNaN(value) ? value : '-'} disabled />
        }}
      </Form.Item>

      <Form.Item
        label="Indice cardíaco"
        shouldUpdate={controller.shouldUpdateIndex}
      >
        {() => {
          const { weight, height, age, heartRate, hemoglobin, arteria, vena } =
            getCurrentFormValues()
          const index = util.calcCardiacIndex(
            weight,
            height,
            age,
            heartRate,
            hemoglobin,
            vena.sat,
            arteria.sat,
            'up'
          )
          const value = index
          return <InputNumber value={!isNaN(value) ? value : '-'} disabled />
        }}
      </Form.Item>
    </>
  )
}

export default FickForm
