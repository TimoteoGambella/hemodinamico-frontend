import { Form, FormInstance, Select, Typography } from 'antd'
import schemeValues from '../constants/diagnosticSchemeValues'
import { useEffect, useState } from 'react'

interface DiagnosticFormProps {
  form: FormInstance
  isEnabled: boolean
}

const DiagnosticForm = ({ form, isEnabled }: DiagnosticFormProps) => {
  const [typeValue, setTypeValue] = useState<string | null>(null)

  useEffect(() => {
    if (typeValue !== 'falla_cardiaca') {
      form.setFieldValue(['diagnostic', 'FEVI'], null)
    }
  }, [typeValue, form])

  return (
    <>
      <Typography.Title level={4}>DIAGNÓSTICO</Typography.Title>
      <Form.Item name={['diagnostic', 'type']} label="Tipo">
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
        shouldUpdate
        label="Sub tipo"
        rules={[
          {
            required: typeValue ? true : false,
            message: 'Por favor seleccione el subtipo del diagnóstico.',
          },
        ]}
      >
        {() => {
          const selected = form.getFieldValue(['diagnostic', 'type'])
          const obj = schemeValues.find((value) => value.name === selected)
          const enabled = selected ? true : false
          const isDisabled = !isEnabled || !enabled
          return (
            <Form.Item name={['diagnostic', 'subtype']} noStyle>
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
        label="Diagnostico 3"
        rules={[
          {
            required: typeValue && typeValue !== 'shock' ? true : false,
            message: 'Por favor seleccione un valor.',
          },
        ]}
      >
        {() => {
          const selected = form.getFieldValue(['diagnostic', 'type'])
          const obj = schemeValues.find((value) => value.name === selected)
          const enabled = selected ? true : false
          const isDisabled = !isEnabled || !(enabled && !!obj?.child)
          return (
            <Form.Item name={['diagnostic', 'child']} noStyle>
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
        label="FEVI"
        rules={[
          {
            required:
              form.getFieldValue(['diagnostic', 'type']) === 'falla_cardiaca',
            message: 'Por favor seleccione un valor.',
          },
        ]}
      >
        {() => {
          let isDisabled =
            form.getFieldValue(['diagnostic', 'type']) !== 'falla_cardiaca'
          isDisabled = !isEnabled || isDisabled
          return (
            <Form.Item name={['diagnostic', 'FEVI']} noStyle>
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
