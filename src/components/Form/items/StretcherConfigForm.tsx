import * as Ant from 'antd'

const options = [
  { value: 'ecmo', label: 'ECMO V-A' },
  { value: 'balon', label: 'BCIAO' },
]

const StretcherConfing = () => {
  return (
    <>
      <Ant.Typography.Title level={4}>
        CONFIGURACIÓN DE CAMA
      </Ant.Typography.Title>

      <Ant.Form.Item
        name="label"
        label="Etiqueta"
        rules={[
          {
            required: true,
            message: 'Por favor ingrese una etiqueta',
          },
        ]}
      >
        <Ant.Input />
      </Ant.Form.Item>

      <Ant.Form.Item
        label="Asistencia"
        name="aid"
        rules={[
          {
            required: true,
            message: 'Por favor selecione al menos una etiqueta',
          },
        ]}
      >
        <Ant.Select
          mode="multiple"
          tagRender={tagRender}
          style={{ width: '100%' }}
          options={options}
        />
      </Ant.Form.Item>
    </>
  )
}

type TagRender = Ant.SelectProps['tagRender']

const tagRender: TagRender = (props) => {
  const { label, value, closable, onClose } = props
  const onPreventMouseDown = (event: React.MouseEvent<HTMLSpanElement>) => {
    event.preventDefault()
    event.stopPropagation()
  }
  return (
    <Ant.Tag
      color={value === 'ecmo' ? 'blue' : 'red'}
      onMouseDown={onPreventMouseDown}
      closable={closable}
      onClose={onClose}
      style={{ marginRight: 3 }}
    >
      {label}
    </Ant.Tag>
  )
}

export default StretcherConfing
