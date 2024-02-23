import { Form, FormInstance, Select, Typography } from 'antd'
import schemeValues from '../constants/diagnosticSchemeValues'
import { useState } from 'react'

interface DiagnosticFormProps {
  form: FormInstance
  isEnabled: boolean
}

const DiagnosticForm = ({ form, isEnabled }: DiagnosticFormProps) => {
  const [typeValue, setTypeValue] = useState<string | null>(null)

  return (
    <>
      <Typography.Title level={4}>DIAGNÓSTICO</Typography.Title>
      <Form.Item name={['diagnostic', 'tipo']} label="Tipo">
        <Select
          onChange={(e) => {
            form.setFieldValue(['diagnostic', 'subTipo'], null)
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
          const selected = form.getFieldValue(['diagnostic', 'tipo'])
          const enabled = selected ? true : false
          const obj = schemeValues.find((value) => value.name === selected)
          return (
            <Form.Item name={['diagnostic', 'subTipo']} noStyle>
              <Select disabled={!isEnabled || !enabled}>
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
        label="Child"
        rules={[
          {
            required: typeValue && typeValue !== 'shock' ? true : false,
            message: 'Por favor seleccione un valor.',
          },
        ]}
      >
        {() => {
          const selected = form.getFieldValue(['diagnostic', 'tipo'])
          const obj = schemeValues.find((value) => value.name === selected)
          const enabled = selected ? true : false
          return (
            <Form.Item name={['diagnostic', 'child']} noStyle>
              <Select disabled={!isEnabled || !(enabled && !!obj?.child)}>
                {obj?.child?.map((value, index) => (
                  <Select.Option key={index} value={value.name}>{value.label}</Select.Option>
                ))}
              </Select>
            </Form.Item>
          )
        }}
      </Form.Item>

      {/*
        TODO: Falta implementar el campo de FEVI
      */}
      <Form.Item shouldUpdate name={['diagnostic', 'FEVI']} label="FEVI">
        <Select disabled>
          <Select.Option value="50">{'>50%'}</Select.Option>
          <Select.Option value="40-">{'40-'}</Select.Option>
          <Select.Option value="40">{'<40%'}</Select.Option>
        </Select>
      </Form.Item>
    </>
  )
}

export default DiagnosticForm
