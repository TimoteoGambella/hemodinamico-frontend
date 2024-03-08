import formLayout from '../../../../constants/formLayout'
import { Select, Input, Form, FormInstance } from 'antd'
import { useState } from 'react'

interface CultivoFormProps {
  form: FormInstance<Cultivo>
}

const CultivoForm = ({ form }: CultivoFormProps) => {
  const [result, setResult] = useState(false)

  return (
    <Form {...formLayout} form={form} name="cultivos-form">
      <Form.Item
        name="cultivo"
        label="Cultivo"
        rules={[
          {
            required: true,
            message: 'Debe seleccionar una opción.',
          },
        ]}
      >
        <Select placeholder="Seleccionar">
          <Select.Option value="hemocultivo">Hemocultivo</Select.Option>
          <Select.Option value="urocultivo">Urocultivo</Select.Option>
          <Select.Option value="cultivo de secreción">
            Cultivo de secreción
          </Select.Option>
        </Select>
      </Form.Item>

      <Form.Item
        name="resultado"
        label="Resultado"
        rules={[
          {
            required: true,
            message: 'Debe seleccionar una opción.',
          },
        ]}
      >
        <Select
          placeholder="Seleccionar"
          onChange={(e) => setResult(e === 'true')}
        >
          <Select.Option value="true">POSITIVO</Select.Option>
          <Select.Option value="false">NEGATIVO</Select.Option>
        </Select>
      </Form.Item>

      <Form.Item
        label="Germen"
        name="germen"
        rules={[
          ({ getFieldValue }) => ({
            required: getFieldValue(['resultado']) === 'true',
            message: 'Este campo es requerido.',
          }),
        ]}
      >
        <Input disabled={!result} />
      </Form.Item>
    </Form>
  )
}

export default CultivoForm
