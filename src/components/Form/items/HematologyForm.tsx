import { Typography, InputNumber, Form } from 'antd'

const HemotologyForm = () => {
  return (
    <>
      <Typography.Title level={4}>HEMATOLOGIA Y COAGULACIÓN</Typography.Title>
      <Form.Item
        name={['hematology', 'hemoglobina']}
        label="Hemoglobina (g/dL)"
        rules={[
          {
            required: true,
            message: 'Por favor ingrese el valor de hemoglobina del paciente',
          },
        ]}
      >
        <InputNumber step={0.1} />
      </Form.Item>

      <Form.Item
        name={['hematology', 'plaquetas']}
        label="Plaquetas (10³ x mm³)"
        rules={[
          {
            required: true,
            message: 'Por favor ingrese el valor de plaquetas del paciente',
          },
        ]}
      >
        <InputNumber step={0.1} />
      </Form.Item>

      <Form.Item
        name={['hematology', 'leucocitos']}
        label="Leucocitos (10³ x mm³)"
        rules={[
          {
            required: true,
            message: 'Por favor ingrese el valor de leucocitos del paciente',
          },
        ]}
      >
        <InputNumber step={0.1} />
      </Form.Item>

      <Form.Item
        name={['hematology', 'bastones']}
        label="Bastones (%)"
        rules={[
          {
            required: true,
            message: 'Por favor ingrese el valor de bastones del paciente',
          },
        ]}
      >
        <InputNumber step={0.1} />
      </Form.Item>

      <Form.Item
        name={['hematology', 'segmentados']}
        label="Segmentados (%)"
        rules={[
          {
            required: true,
            type: 'number',
            message: 'Por favor ingrese el valor de segmentados del paciente',
          },
        ]}
      >
        <InputNumber step={0.1} />
      </Form.Item>

      <Form.Item
        name={['hematology', 'INR']}
        label="I.N.R"
        rules={[
          {
            required: true,
            type: 'number',
            message: 'Por favor ingrese el valor de INR del paciente',
          },
        ]}
      >
        <InputNumber step={0.1} />
      </Form.Item>

      <Form.Item
        name={['hematology', 'protrombina']}
        label="T. Protrombina (Seg)"
        rules={[
          {
            required: true,
            type: 'number',
            message: 'Por favor ingrese el valor de protrombina del paciente',
          },
        ]}
      >
        <InputNumber step={0.1} />
      </Form.Item>

      <Form.Item
        name={['hematology', 'TPA']}
        label="T. TPA (seg)"
        rules={[
          {
            required: true,
            type: 'number',
            message: 'Por favor ingrese el valor de TPA del paciente',
          },
        ]}
      >
        <InputNumber step={0.1} />
      </Form.Item>
    </>
  )
}

export default HemotologyForm
