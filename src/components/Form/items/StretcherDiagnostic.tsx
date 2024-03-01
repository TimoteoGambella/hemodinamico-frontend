import { Form, FormInstance, Select, Typography } from 'antd'
import { useEffect, useState } from 'react'

interface StretcherDiagnosticProps {
  form: FormInstance<StretcherData>
}

const StretcherDiagnostic = ({ form }: StretcherDiagnosticProps) => {
  const [isDisabled, SetIsDisabled] = useState(
    form.getFieldValue(['diagnostic', 'type']) !== 'falla_avanzada'
  )

  useEffect(() => {
    if (isDisabled) form.setFieldValue(['diagnostic', 'subType'], null)
  }, [isDisabled, form])
  return (
    <>
      <Typography.Title level={4}>DIAGNÓSTICO</Typography.Title>
      <Form.Item name={['diagnostic', 'type']} label="Tipo">
        <Select onChange={(e) => SetIsDisabled(e !== 'falla_avanzada')}>
          <Select.Option value="">NINGUNO</Select.Option>
          <Select.Option value="shock_isq">
            SHOCK CARDIOGENICO ISQUEMICO
          </Select.Option>
          <Select.Option value="shock">
            SHOCK CARDIOGENICO NO ISQUEMICO
          </Select.Option>
          <Select.Option value="falla_avanzada">FALLA AVANZADA</Select.Option>
        </Select>
      </Form.Item>
      <Form.Item shouldUpdate noStyle>
        {(form) => {
          const selected = form.getFieldValue(['diagnostic', 'type'])
          return (
            <Form.Item
              name={['diagnostic', 'subType']}
              label="Sub tipo"
              rules={[
                {
                  required: !isDisabled,
                  message: 'Por favor seleccione una opción.',
                },
              ]}
            >
              <Select disabled={selected !== 'falla_avanzada'}>
                <Select.Option value="intermacs_1">INTERMACS I</Select.Option>
                <Select.Option value="intermacs_2">INTERMACS II</Select.Option>
                <Select.Option value="intermacs_3">INTERMACS III</Select.Option>
              </Select>
            </Form.Item>
          )
        }}
      </Form.Item>
    </>
  )
}

export default StretcherDiagnostic
