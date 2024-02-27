import { Form, FormInstance, InputNumber, Typography } from 'antd'

interface FickFormProps {
  form: FormInstance
}

const FickForm = ({ form }: FickFormProps) => {

  return (
    <>
      <Typography.Title level={4}>FICK INDIRECTO</Typography.Title>
      <Form.Item name={['fick', 'hemoglobina']} label="Hemoglobina">
        <InputNumber />
      </Form.Item>

      <Form.Item label="Consumo de O2 (VO2)">
        <InputNumber value={Number(form.getFieldValue(['fick', 'hemoglobina'])) * 2 || '-'} disabled />
      </Form.Item>
      <Form.Item label="Diferencia A-V sistémica">
        <InputNumber value={Number(form.getFieldValue(['fick', 'hemoglobina'])) * 2 || '-'} disabled />
      </Form.Item>

      <Form.Item label="Contenido O2 en AP">
        <InputNumber value={Number(form.getFieldValue(['fick', 'hemoglobina'])) * 2 || '-'} disabled />
      </Form.Item>

      <Form.Item label="Contenido O2 en Ao">
        <InputNumber value={Number(form.getFieldValue(['fick', 'hemoglobina'])) * 2 || '-'} disabled />
      </Form.Item>
      <Form.Item label="Capacidad de Hb">
        <InputNumber value={Number(form.getFieldValue(['fick', 'hemoglobina'])) * 2 || '-'} disabled />
      </Form.Item>

      <Form.Item label="Gasto cardíaco">
        <InputNumber value={Number(form.getFieldValue(['fick', 'hemoglobina'])) * 2 || '-'} disabled />
      </Form.Item>

      <Form.Item label="Indice cardíaco">
        <InputNumber value={Number(form.getFieldValue(['fick', 'hemoglobina'])) * 2 || '-'} disabled />
      </Form.Item>
    </>
  )
}

export default FickForm
