import { Flex, Form, FormInstance, InputNumber, Typography } from 'antd'

interface GasometricFormProps {
  form: FormInstance
}

const GasometricForm = ({ form }: GasometricFormProps) => {
  const getCurrentFormValues = () => {
    const vena = form.getFieldValue(['muestra', 'vena'])
    const arteria = form.getFieldValue(['muestra', 'arteria'])
    return {
      vena,
      arteria,
    }
  }

  return (
    <>
      <Typography.Title level={4}>MUESTRAS GASOMÉTRICAS</Typography.Title>

      <Flex vertical>
        <Typography.Title level={5}>VENA</Typography.Title>
        <Form.Item
          name={['muestra', 'vena', 'sat']}
          label="Sat O2"
          rules={[
            {
              required: true,
              message: 'Debe ingresar la saturación de oxígeno de la vena',
            },
          ]}
        >
          <InputNumber />
        </Form.Item>
        <Form.Item
          name={['muestra', 'vena', 'pC02']}
          label="pCO2"
          rules={[
            {
              required: true,
              message: 'Debe ingresar la presión de CO2 de la vena',
            },
          ]}
        >
          <InputNumber />
        </Form.Item>
      </Flex>

      <Flex vertical>
        <Typography.Title level={5}>ARTERIA</Typography.Title>
        <Form.Item
          name={['muestra', 'arteria', 'sat']}
          label="Sat O2"
          rules={[
            {
              required: true,
              message: 'Debe ingresar la saturación de oxígeno de la arteria',
            },
          ]}
        >
          <InputNumber />
        </Form.Item>
        <Form.Item
          name={['muestra', 'arteria', 'pC02']}
          label="pCO2"
          rules={[
            {
              required: true,
              message: 'Debe ingresar la presión de CO2 de la arteria',
            },
          ]}
        >
          <InputNumber />
        </Form.Item>
        <Form.Item
          name={['muestra', 'arteria', 'lactato']}
          label="Lacto"
          rules={[
            {
              required: true,
              message: 'Debe ingresar el lactato de la arteria',
            },
          ]}
        >
          <InputNumber />
        </Form.Item>
      </Flex>
      <Form.Item label="Delta CO2" shouldUpdate>
        {() => {
          const { vena, arteria } = getCurrentFormValues()
          if (!vena || !arteria) return <InputNumber disabled />
          const value = Number(vena.pC02) - Number(arteria.pC02)
          return <InputNumber value={!isNaN(value) ? value : '-'} disabled />
        }}
      </Form.Item>
    </>
  )
}

export default GasometricForm
