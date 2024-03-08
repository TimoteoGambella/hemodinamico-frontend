import { Form, FormInstance, InputNumber, Typography } from 'antd'
import EditableTable from '../EditableTable'

interface InfectiveFormProps {
  form: FormInstance
  isEnabled: boolean
  cultivos: CultivoFormType[]
  setCultivos: (value: CultivoFormType[]) => void
}

const InfectiveProfileForm = ({ cultivos, setCultivos }: InfectiveFormProps) => {
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

      <EditableTable.Infective data={cultivos} setData={setCultivos} />
    </>
  )
}

export default InfectiveProfileForm
