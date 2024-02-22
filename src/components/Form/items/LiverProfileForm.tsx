import { FormInstance, Typography, InputNumber, Input, Form } from 'antd'

const LiverProfileForm = ({ form }: { form: FormInstance }) => {
  const handleIndirectB = () => {
    const value = Number(
      form.getFieldValue(['liver_profile', 'bilirrubina', 'total']) -
        form.getFieldValue(['liver_profile', 'bilirrubina', 'directa'])
    ).toFixed(2)
    return isNaN(Number(value)) ? '-' : value
  }
  return (
    <>
      <Typography.Title level={4}>PERFIL HEPÁTICO</Typography.Title>
      <Form.Item
        name={['liver_profile', 'TGO']}
        label="TGO (U/L)"
        rules={[
          {
            required: true,
            message: 'Por favor ingrese el valor de TGO del paciente',
          },
        ]}
      >
        <InputNumber step={0.1} />
      </Form.Item>

      <Form.Item
        name={['liver_profile', 'TGP']}
        label="TGP (U/L)"
        rules={[
          {
            required: true,
            message: 'Por favor ingrese el valor de TGP del paciente',
          },
        ]}
      >
        <InputNumber step={0.1} />
      </Form.Item>

      <Form.Item
        name={['liver_profile', 'albumina']}
        label="Albumina (g/dL)"
        rules={[
          {
            required: true,
            message: 'Por favor ingrese el valor de albumina del paciente',
          },
        ]}
      >
        <InputNumber step={0.1} />
      </Form.Item>

      <Form.Item
        name={['liver_profile', 'bilirrubina', 'total']}
        label="Bilirrubina total (mg/dL)"
        rules={[
          {
            required: true,
            message:
              'Por favor ingrese el valor de bilirrubina total del paciente',
          },
        ]}
      >
        <InputNumber step={0.1} />
      </Form.Item>

      <Form.Item
        name={['liver_profile', 'bilirrubina', 'directa']}
        label="B. directa (mg/dL)"
        rules={[
          {
            required: true,
            type: 'number',
            message:
              'Por favor ingrese el valor de bilirrubina directa del paciente',
          },
        ]}
      >
        <InputNumber step={0.1} />
      </Form.Item>

      <Form.Item shouldUpdate label="B. indirecta (mg/dL)">
        {() => {
          return <Input value={handleIndirectB()} readOnly disabled />
        }}
      </Form.Item>

      <Form.Item
        name={['liver_profile', 'fosfatasa']}
        label="Fosfatasa alcalina (U/L)"
        rules={[
          {
            required: true,
            type: 'number',
            message:
              'Por favor ingrese el valor de fosfatasa alcalina del paciente',
          },
        ]}
      >
        <InputNumber step={0.1} />
      </Form.Item>
    </>
  )
}

export default LiverProfileForm
