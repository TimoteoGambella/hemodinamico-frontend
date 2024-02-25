import {
  Typography,
  Input,
  Select,
  InputNumber,
  Form,
  FormInstance,
} from 'antd'
import { validateInputNumber } from '../controller'

interface LabPatientFormProps {
  showTitle?: boolean
  freeStretchers?: StretcherData[]
  form?: FormInstance
}

const LabPatientForm = ({ freeStretchers, showTitle = true, form }: LabPatientFormProps) => {
  if (freeStretchers && !form)
    throw new Error('form prop is required when stretchers prop is present')
  const itemProps = {
    tooltip:
      form?.getFieldValue(['patientId', 'stretcherId']) === 'auto'
        ? 'Seleccione una camilla'
        : null,
  }
  return (
    <>
      {showTitle && (
        <Typography.Title level={4}>INFORMACIÓN DEL PACIENTE</Typography.Title>
      )}
      <Form.Item
        name={['patientId', 'fullname']}
        label="Nombre completo"
        rules={[
          {
            required: true,
            message: 'Por favor ingrese el nombre del paciente',
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name={['patientId', 'dni']}
        label="DNI"
        rules={[
          {
            required: true,
            message: 'Por favor ingrese el DNI del paciente',
          },
          () => ({
            validator(_rule, value) {
              if (!value) return Promise.reject()
              if (value && value.toString().length === 8) {
                return Promise.resolve()
              } else {
                return Promise.reject('El DNI debe tener 8 dígitos')
              }
            },
          }),
        ]}
      >
        <Input maxLength={8} onInput={validateInputNumber} />
      </Form.Item>

      <Form.Item
        name={['patientId', 'gender']}
        label="Sexo"
        rules={[
          {
            required: true,
            message: 'Por favor seleccione el sexo del paciente',
          },
        ]}
      >
        <Select>
          <Select.Option value="M">Masculino</Select.Option>
          <Select.Option value="F">Femenino</Select.Option>
        </Select>
      </Form.Item>

      <Form.Item
        name={['patientId', 'age']}
        label="Edad"
        rules={[
          {
            required: true,
            message: 'Por favor ingrese la edad del paciente',
          },
        ]}
      >
        <Input maxLength={3} onInput={validateInputNumber} />
      </Form.Item>

      <Form.Item
        name={['patientId', 'height']}
        label="Talla (cm)"
        rules={[
          {
            required: true,
            type: 'number',
            message: 'Por favor ingrese la talla del paciente',
          },
        ]}
      >
        <InputNumber step={0.1} />
      </Form.Item>

      <Form.Item
        name={['patientId', 'weight']}
        label="Peso (kg)"
        rules={[
          {
            required: true,
            type: 'number',
            message: 'Por favor ingrese el peso del paciente',
          },
        ]}
      >
        <InputNumber step={0.1} />
      </Form.Item>

      <Form.Item
        name={['patientId', 'bloodType']}
        label="Grupo sanguíneo"
        rules={[
          {
            required: true,
            message: 'Por favor seleccione el grupo sanguíneo del paciente.',
          },
        ]}
      >
        <Select>
          <Select.Option value="A+">A+</Select.Option>
          <Select.Option value="A-">A-</Select.Option>
          <Select.Option value="B+">B+</Select.Option>
          <Select.Option value="B-">B-</Select.Option>
          <Select.Option value="AB+">AB+</Select.Option>
          <Select.Option value="AB-">AB-</Select.Option>
          <Select.Option value="O+">O+</Select.Option>
          <Select.Option value="O-">O-</Select.Option>
        </Select>
      </Form.Item>

      {freeStretchers && (
        <Form.Item
          name={['patientId', 'stretcherId']}
          label="Camilla"
          {...itemProps}
        >
          <Select>
            <Select.Option value="">Ninguno</Select.Option>
            <Select.Option value="auto">Automático</Select.Option>
            {freeStretchers.map((stretcher) => {
              if (stretcher.patientId) return null
              return (
                <Select.Option value={stretcher._id} key={stretcher._id}>
                  {stretcher.label ?? stretcher._id}
                </Select.Option>
              )
            })}
          </Select>
        </Form.Item>
      )}
    </>
  )
}

export default LabPatientForm
