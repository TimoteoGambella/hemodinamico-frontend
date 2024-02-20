import { useState } from 'react'
import {
  Form,
  FormInstance,
  Input,
  InputNumber,
  Select,
  Typography,
} from 'antd'

const InfectiveProfileForm = ({ form }: { form: FormInstance }) => {
  const [germenValue, setGermenValue] = useState('')
  const [isRequired, setIsRequired] = useState(false)

  const handleChange = (e: 'true' | 'false') => {
    if (e === 'false') {
      setGermenValue('')
      setIsRequired(false)
    } else {
      setIsRequired(true)
    }
  }
  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGermenValue(e.target.value)
  }

  return (
    <>
      <Typography.Title level={4}>INFECCIOSO E INFLAMATORIO</Typography.Title>
      <Form.Item
        name={['infective', 'proteinaC']}
        label="Protetina C reactiva"
        rules={[
          {
            required: true,
            message:
              'Por favor ingrese el valor de proteína C reactiva del paciente',
          },
        ]}
      >
        <InputNumber step={0.1} />
      </Form.Item>

      <Form.Item
        name={['infective', 'procalcitonina']}
        label="Procalcitonina"
        rules={[
          {
            required: true,
            message:
              'Por favor ingrese el valor de procalcitonina del paciente',
          },
        ]}
      >
        <InputNumber step={0.1} />
      </Form.Item>

      <Form.Item
        name={['infective', 'cultivo']}
        label="Cultivo"
        rules={[
          {
            required: true,
            message: 'Por favor seleccione el tipo de cultivo del paciente',
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
        name={['infective', 'resultado']}
        label="Resultado del cultivo"
        rules={[
          {
            required: true,
            message:
              'Por favor seleccione el resultado del cultivo del paciente',
          },
        ]}
      >
        <Select placeholder="Seleccionar" onChange={handleChange}>
          <Select.Option value="true">POSITIVO</Select.Option>
          <Select.Option value="false">NEGATIVO</Select.Option>
        </Select>
      </Form.Item>

      <Form.Item
        shouldUpdate
        label="Germen"
        rules={[
          {
            required: isRequired,
            message: 'Por favor ingrese el valor de CA-125 del paciente',
          },
        ]}
      >
        {() => {
          return (
            <Input
              onInput={handleInput}
              value={germenValue}
              disabled={
                form.getFieldValue(['infective', 'resultado']) !== 'true'
              }
            />
          )
        }}
      </Form.Item>
    </>
  )
}

export default InfectiveProfileForm
