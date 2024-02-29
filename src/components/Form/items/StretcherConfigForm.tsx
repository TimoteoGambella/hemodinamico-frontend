import { Form, Input, Select, SelectProps, Tag, Typography } from 'antd'

const options = [
  { value: 'ecmo' },
  { value: 'balon' }
]

const StretcherConfing = () => {
  return (
    <>
      <Typography.Title level={4}>CONFIGURACIÓN DE CAMA</Typography.Title>

      <Form.Item
        name="label"
        label="Etiqueta"
        rules={[
          {
            required: true,
            message: 'Por favor ingrese una etiqueta',
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="aid"
        label="Asistencia"
        rules={[
          {
            required: true,
            message: 'Por favor selecione al menos una etiqueta',
          },
        ]}
      >
        <Select
          mode="multiple"
          tagRender={tagRender}
          style={{ width: '100%' }}
          options={options}
        />
      </Form.Item>
    </>
  )
}

type TagRender = SelectProps['tagRender']

const tagRender: TagRender = (props) => {
  const { label, value, closable, onClose } = props
  const onPreventMouseDown = (event: React.MouseEvent<HTMLSpanElement>) => {
    event.preventDefault()
    event.stopPropagation()
  }
  return (
    <Tag
      color={value === 'ecmo' ? 'blue' : 'red'}
      onMouseDown={onPreventMouseDown}
      closable={closable}
      onClose={onClose}
      style={{ marginRight: 3 }}
    >
      {label}
    </Tag>
  )
}

export default StretcherConfing
