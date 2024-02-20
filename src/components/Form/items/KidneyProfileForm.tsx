import { Form, Input, InputNumber, Typography } from 'antd'

const KidneyProfileForm = () => {
  return (
    <>
      <Typography.Title level={4}>PERFIL RENAL</Typography.Title>
      <Form.Item
        name={['kidney', 'urea']}
        label="Urea (mg/dL)"
        rules={[
          {
            required: true,
            message: 'Por favor ingrese el valor de urea del paciente en mg/dL',
          },
        ]}
      >
        <InputNumber step={0.1} />
      </Form.Item>

      <Form.Item
        name={['kidney', 'creatinina']}
        label="Creatinina (mg/dL)"
        rules={[
          {
            required: true,
            message:
              'Por favor ingrese el valor de creatinina del paciente en mg/dL',
          },
        ]}
      >
        <InputNumber step={0.1} />
      </Form.Item>

      <Form.Item
        name={['kidney', 'TFG']}
        label="T.F.G (C-G)"
        rules={[
          {
            required: true,
            message: 'Por favor ingrese el valor de TFG del paciente',
          },
        ]}
      >
        <Input readOnly />
      </Form.Item>
    </>
  )
}

export default KidneyProfileForm
