import { Form, InputNumber, Typography } from "antd"

const CardiacProfileForm = () => {
  return (
    <>
      <Typography.Title level={4}>PERFIL CARDIACO</Typography.Title>
      <Form.Item
        name={['cardiac_profile', 'troponina']}
        label="Troponina T (ng/mL)"
        rules={[
          {
            required: true,
            message: 'Por favor ingrese el valor de troponina T del paciente',
          },
        ]}
      >
        <InputNumber step={0.1} />
      </Form.Item>

      <Form.Item
        name={['cardiac_profile', 'CPK']}
        label="CPK-MB (U/L)"
        rules={[
          {
            required: true,
            message: 'Por favor ingrese el valor de CPK-MB del paciente',
          },
        ]}
      >
        <InputNumber step={0.1} />
      </Form.Item>

      <Form.Item
        name={['cardiac_profile', 'PRO']}
        label="PRO-BNP"
        rules={[
          {
            required: true,
            message: 'Por favor ingrese el valor de PRO-BNP del paciente',
          },
        ]}
      >
        <InputNumber step={0.1} />
      </Form.Item>

      <Form.Item
        name={['cardiac_profile', 'CA125']}
        label="CA-125"
        rules={[
          {
            required: true,
            message: 'Por favor ingrese el valor de CA-125 del paciente',
          },
        ]}
      >
        <InputNumber step={0.1} />
      </Form.Item>
    </>
  )
}

export default CardiacProfileForm
