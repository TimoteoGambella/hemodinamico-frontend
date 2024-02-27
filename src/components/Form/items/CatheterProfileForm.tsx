import { Form, FormInstance, InputNumber, Typography } from 'antd'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface CatheterFormProps {
  form: FormInstance
}

const CatheterForm = () => {

  return (
    <>
      <Typography.Title level={4}>CATETER DE ARTERIA PULMONAR</Typography.Title>

      <Form.Item name={['cateter', 'presion', 'AD']} label="Presion AD">
        <InputNumber />
      </Form.Item>

      <Form.Item name={['cateter', 'presion', 'capilar']} label="Presión Capilar">
        <InputNumber />
      </Form.Item>

      <Form.Item name={['cateter', 'PAP', 'sistolica']} label="PAP sistólica">
        <InputNumber />
      </Form.Item>

      <Form.Item name={['cateter', 'PAP', 'diastolica']} label="PAP diastólica">
        <InputNumber />
      </Form.Item>

      <Form.Item name={['cateter', 'presion', 'mediaSistemica']} label="Presión media sistemática">
        <InputNumber />
      </Form.Item>

      <Form.Item name={['cateter', 'gasto']} label="Gasto cardíaco (TD)">
        <InputNumber />
      </Form.Item>

      {/* DISABLED FIELDS */}

      <Form.Item label="PAP media">
        <InputNumber disabled />
      </Form.Item>

      <Form.Item label="Gradiente TP">
        <InputNumber disabled />
      </Form.Item>

      <Form.Item label="Resistencia sistémica (dynas)">
        <InputNumber disabled />
      </Form.Item>

      <Form.Item label="Resistencia pulmonar (uW)">
        <InputNumber disabled />
      </Form.Item>

      <Form.Item label="Índice Cardíaco (TD)">
        <InputNumber disabled />
      </Form.Item>
    </>
  )
}

export default CatheterForm
