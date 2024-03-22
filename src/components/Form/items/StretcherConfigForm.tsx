import * as Ant from 'antd'

const options = [{ value: 'ecmo' }, { value: 'balon' }]

const StretcherConfing = () => {
  const handleUpdate = (form: Ant.FormInstance) => {
    const val = form.getFieldValue('aid') as string[]
    if (val.length > 1) {
      form.setFieldValue('aid', val.slice(1))
    }
  }
  return (
    <>
      <Ant.Typography.Title level={4}>CONFIGURACIÓN DE CAMA</Ant.Typography.Title>

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
        shouldUpdate={(curValue, prevValue) => curValue.aid !== prevValue.aid}
      >
        {(form) => {
          return (
            <Ant.Form.Item
              name="aid"
              rules={[
                {
                  required: true,
                  message: 'Por favor selecione al menos una etiqueta',
                },
              ]}
              noStyle
            >
              <Ant.Select
                mode="multiple"
                tagRender={tagRender}
                onChange={() => handleUpdate(form)}
                style={{ width: '100%' }}
                options={options}
              />
            </Ant.Form.Item>
          )
        }}
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
