import { Form, FormInstance, Select, Typography } from 'antd'
import schemeValues from '../constants/diagnosticSchemeValues'
import { useEffect, useState } from 'react'

interface DiagnosticFormProps {
  form: FormInstance
  isEnabled: boolean
}

const DiagnosticForm = ({ form, isEnabled }: DiagnosticFormProps) => {
  const [typeValue, setTypeValue] = useState<string | null>(
    form.getFieldValue(['diagnostic', 'type']) || null
  )

  useEffect(() => {
    if (typeValue !== 'falla_cardiaca') {
      form.setFieldValue(['diagnostic', 'FEVI'], null)
    }
  }, [typeValue, form])

  return (
    <>
      <Typography.Title level={4}>DIAGNÓSTICO</Typography.Title>
      <Form.Item name={['diagnostic', 'type']} label="Diagnostico 1">
        <Select
          placeholder="Seleccionar"
          onChange={(e) => {
            form.setFieldValue(['diagnostic', 'subtype'], null)
            form.setFieldValue(['diagnostic', 'child'], null)
            setTypeValue(e)
          }}
        >
          {schemeValues.map((value, index) => (
            <Select.Option key={index} value={value.name}>
              {value.label}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        shouldUpdate={(prevValues, curValues) => {
          const type = prevValues.diagnostic?.type
          return type !== curValues.diagnostic?.type
        }}
        label="Diagnostico 2"
        rules={[
          {
            required: typeValue ? true : false,
          },
        ]}
      >
        {() => {
          const selected = form.getFieldValue(['diagnostic', 'type'])
          const obj = schemeValues.find((value) => value.name === selected)
          const enabled = selected ? true : false
          const isDisabled = !isEnabled || !enabled
          return (
            <Form.Item
              name={['diagnostic', 'subtype']}
              rules={[
                {
                  required: typeValue ? true : false,
                  message: 'Por favor seleccione una opción.',
                },
              ]}
              noStyle
            >
              <Select
                placeholder={!isDisabled ? 'Seleccionar' : null}
                disabled={isDisabled}
              >
                {obj?.subType.map((value, index) => (
                  <Select.Option key={index} value={value.name}>
                    {value.label}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          )
        }}
      </Form.Item>

      <Form.Item
        shouldUpdate={(prevValues, curValues) => {
          if (!prevValues['diagnostic']) return false
          return (
            prevValues['diagnostic']?.tipo !== curValues['diagnostic']?.tipo
          )
        }}
        rules={[
          {
            required: typeValue && typeValue !== 'shock' ? true : false,
          },
        ]}
        label="Diagnostico 3"
      >
        {() => {
          const selected = form.getFieldValue(['diagnostic', 'type'])
          const obj = schemeValues.find((value) => value.name === selected)
          const enabled = selected ? true : false
          const isDisabled = !isEnabled || !(enabled && !!obj?.child)
          return (
            <Form.Item
              name={['diagnostic', 'child']}
              rules={[
                {
                  required: typeValue && typeValue !== 'shock' ? true : false,
                  message: 'Por favor seleccione una opción.',
                },
              ]}
              noStyle
            >
              <Select
                placeholder={!isDisabled ? 'Seleccionar' : null}
                disabled={isDisabled}
              >
                {obj?.child?.map((value, index) => (
                  <Select.Option key={index} value={value.name}>
                    {value.label}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          )
        }}
      </Form.Item>

      <Form.Item
        shouldUpdate={(prevValues, curValues) => {
          const type = prevValues.diagnostic?.type
          return type !== curValues.diagnostic?.type
        }}
        rules={[
          {
            required:
              form.getFieldValue(['diagnostic', 'type']) === 'falla_cardiaca',
          },
        ]}
        label="FEVI (%)"
      >
        {() => {
          let isDisabled =
            form.getFieldValue(['diagnostic', 'type']) !== 'falla_cardiaca'
          isDisabled = !isEnabled || isDisabled
          return (
            <Form.Item
              name={['diagnostic', 'FEVI']}
              rules={[
                {
                  required:
                    form.getFieldValue(['diagnostic', 'type']) ===
                    'falla_cardiaca',
                  message: 'Por favor seleccione una opción.',
                },
              ]}
              noStyle
            >
              <Select
                placeholder={!isDisabled ? 'Seleccionar' : ''}
                disabled={isDisabled}
              >
                <Select.Option value="50">{'>50%'}</Select.Option>
                <Select.Option value="40-">{'40-'}</Select.Option>
                <Select.Option value="40">{'<40%'}</Select.Option>
              </Select>
            </Form.Item>
          )
        }}
      </Form.Item>
    </>
  )
}

export default DiagnosticForm
