import { Form, Input, InputNumber, Typography } from 'antd'
import { calcTFG } from '../utils/formulas'

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

      <Form.Item shouldUpdate label="T.F.G (C-G)">
        {(form) => {
          const creatinina = form.getFieldValue(['kidney', 'creatinina']) || '-'
          const weight = form.getFieldValue(['patientId', 'weight']) || '-'
          const gender = form.getFieldValue(['patientId', 'gender']) || '-'
          const age = form.getFieldValue(['patientId', 'age']) || '-'
          const value = calcTFG(gender, creatinina, age, weight)
          return <Input value={!isNaN(value) ? value : '-'} disabled />
        }}
      </Form.Item>
    </>
  )
}

export default KidneyProfileForm
