import { Typography, InputNumber, Form, FormInstance } from 'antd'
import * as util from '../../../utils/formulas'

interface CalculedVariablesProps {
  form: FormInstance
}

const CalculedVariables = ({ form }: CalculedVariablesProps) => {
  const getCurrentFormValues = () => {
    const mediaSis = form.getFieldValue([
      'cateter',
      'presion',
      'mediaSistemica',
    ])
    const diastolica = form.getFieldValue(['cateter', 'PAP', 'diastolica'])
    const sistolica = form.getFieldValue(['cateter', 'PAP', 'sistolica'])
    const capilar = form.getFieldValue(['cateter', 'presion', 'capilar'])
    const AD = form.getFieldValue(['cateter', 'presion', 'AD'])
    const heartRate = form.getFieldValue(['patientHeartRate'])
    const weight = form.getFieldValue(['patientId', 'weight'])
    const height = form.getFieldValue(['patientId', 'height'])
    const gasto = form.getFieldValue(['cateter', 'gasto'])
    return {
      diastolica,
      heartRate,
      sistolica,
      mediaSis,
      capilar,
      height,
      weight,
      gasto,
      AD,
    }
  }

  return (
    <>
      <Typography.Title level={4}>VARIABLES CALCULADAS</Typography.Title>

      <Form.Item label="Poder Cardíaco" shouldUpdate>
        {() => {
          const { gasto, mediaSis } = getCurrentFormValues()
          const value = util.calcCardiacPower(gasto, mediaSis)
          return <InputNumber value={!isNaN(value) ? value : '-'} disabled />
        }}
      </Form.Item>

      <Form.Item label="Poder cardiaco indexado (iPC)" shouldUpdate>
        {() => {
          const { gasto, mediaSis, weight, height } = getCurrentFormValues()
          const value = util.calcIndexedCardiacPower(
            gasto,
            mediaSis,
            weight,
            height
          )
          return <InputNumber value={!isNaN(value) ? value : '-'} disabled />
        }}
      </Form.Item>

      <Form.Item label="PAPi" shouldUpdate>
        {() => {
          const { sistolica, diastolica, AD } = getCurrentFormValues()
          const value = util.calcPAPi(sistolica, diastolica, AD)
          return <InputNumber value={!isNaN(value) ? value : '-'} disabled />
        }}
      </Form.Item>

      <Form.Item label="PVC/PCP" shouldUpdate>
        {() => {
          const { AD, capilar } = getCurrentFormValues()
          const value = Number((Number(AD) / Number(capilar)).toFixed(2))
          return <InputNumber value={!isNaN(value) ? value : '-'} disabled />
        }}
      </Form.Item>

      <Form.Item label="iTSVD" shouldUpdate>
        {() => {
          const {
            sistolica,
            diastolica,
            AD,
            gasto,
            weight,
            height,
            heartRate,
          } = getCurrentFormValues()
          const value = util.calcITSVD(
            sistolica,
            diastolica,
            AD,
            gasto,
            weight,
            height,
            heartRate
          )
          return <InputNumber value={!isNaN(value) ? value : '-'} disabled />
        }}
      </Form.Item>

      <Form.Item label="iTSVI" shouldUpdate>
        {() => {
          const { mediaSis, capilar, gasto, heartRate, weight, height } =
            getCurrentFormValues()
          const value = util.calcITSVI(
            mediaSis,
            capilar,
            gasto,
            heartRate,
            weight,
            height
          )
          return <InputNumber value={!isNaN(value) ? value : '-'} disabled />
        }}
      </Form.Item>
    </>
  )
}

export default CalculedVariables
