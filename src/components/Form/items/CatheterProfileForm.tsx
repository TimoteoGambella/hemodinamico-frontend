import { Form, FormInstance, InputNumber, Typography } from 'antd'
import * as ctrl from '../controller/catheterProfile.controller'
import * as util from '../utils/formulas'

interface CatheterFormProps {
  form: FormInstance
}

const CatheterForm = ({ form }: CatheterFormProps) => {
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
    const weight = form.getFieldValue(['patientId', 'weight'])
    const height = form.getFieldValue(['patientId', 'height'])
    const gasto = form.getFieldValue(['cateter', 'gasto'])
    return {
      sistolica,
      diastolica,
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
      <Typography.Title level={4}>CATETER DE ARTERIA PULMONAR</Typography.Title>

      <Form.Item name={['cateter', 'presion', 'AD']} label="Presion AD">
        <InputNumber />
      </Form.Item>

      <Form.Item
        name={['cateter', 'presion', 'capilar']}
        label="Presión Capilar"
      >
        <InputNumber />
      </Form.Item>

      <Form.Item name={['cateter', 'PAP', 'sistolica']} label="PAP sistólica">
        <InputNumber />
      </Form.Item>

      <Form.Item name={['cateter', 'PAP', 'diastolica']} label="PAP diastólica">
        <InputNumber />
      </Form.Item>

      <Form.Item
        name={['cateter', 'presion', 'mediaSistemica']}
        label="Presión media sistemática"
      >
        <InputNumber />
      </Form.Item>

      <Form.Item name={['cateter', 'gasto']} label="Gasto cardíaco (TD)">
        <InputNumber />
      </Form.Item>

      {/* DISABLED FIELDS */}

      <Form.Item label="PAP media" shouldUpdate={ctrl.shouldUpdatePAP}>
        {() => {
          const { diastolica, sistolica } = getCurrentFormValues()
          const value = util.calcAvgPAP(sistolica, diastolica, 'up')
          return <InputNumber value={!isNaN(value) ? value : '-'} disabled />
        }}
      </Form.Item>

      <Form.Item label="Gradiente TP" shouldUpdate={ctrl.shouldUpdateTP}>
        {() => {
          const { capilar, sistolica, diastolica } = getCurrentFormValues()
          const value = util.calcTPGradient(
            sistolica,
            diastolica,
            capilar,
            'up'
          )
          return <InputNumber value={!isNaN(value) ? value : '-'} disabled />
        }}
      </Form.Item>

      <Form.Item
        label="Resistencia sistémica (dynas)"
        shouldUpdate={ctrl.shouldUpdateSys}
      >
        {() => {
          const { mediaSis, AD, gasto } = getCurrentFormValues()
          const value = util.calcSysEndurance(mediaSis, AD, gasto, 'up')
          return <InputNumber value={!isNaN(value) ? value : '-'} disabled />
        }}
      </Form.Item>

      <Form.Item
        label="Resistencia pulmonar (uW)"
        shouldUpdate={ctrl.shouldUpdatePulmonary}
      >
        {() => {
          const { sistolica, diastolica, capilar, gasto } =
            getCurrentFormValues()
          const value = util.calcPulmonaryResistance(
            sistolica,
            diastolica,
            capilar,
            gasto,
            'down'
          )
          return <InputNumber value={!isNaN(value) ? value : '-'} disabled />
        }}
      </Form.Item>

      <Form.Item
        label="Índice Cardíaco (TD)"
        shouldUpdate={ctrl.shouldUpdateIndex}
      >
        {() => {
          const { gasto, weight, height } = getCurrentFormValues()
          const value = util.calcCardiacIndexTD(gasto, weight, height)
          return <InputNumber value={!isNaN(value) ? value : '-'} disabled />
        }}
      </Form.Item>
    </>
  )
}

export default CatheterForm
