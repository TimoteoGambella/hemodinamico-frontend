import { suppliedSchema } from '../../../../constants/suppliedSchemaDrugs'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { Cascader, Form, InputNumber } from 'antd'
import { EditableContext, Item } from './EditableRow'

interface EditableCellProps {
  title: React.ReactNode
  editable: boolean
  children: React.ReactNode
  dataIndex: keyof Item
  record: Item
  handleSave: (record: Item) => void
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const EditableCell = ({ title, editable, children, dataIndex, record, handleSave, ...restProps }: EditableCellProps) => {
  const [editing, setEditing] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const form = useContext(EditableContext)!

  useEffect(() => {
    if (editing) {
      inputRef.current!.focus()
    }
  }, [editing])

  const toggleEdit = () => {
    setEditing(!editing)
    form.setFieldsValue({ [dataIndex]: record[dataIndex] })
  }

  const save = async () => {
    try {
      const values = await form.validateFields()

      toggleEdit()
      handleSave({ ...record, ...values })
    } catch (errInfo) {
      console.log('Save failed:', errInfo)
    }
  }

  let childNode = children

  if (editable && dataIndex === 'name') {
    childNode = editing ? (
      <Form.Item
        style={{ margin: 0 }}
        name={dataIndex}
        initialValue={'SELECCIONAR'}
        rules={[
          {
            required: true,
            message: 'Debe seleccionar una opción.',
            validator(_, value) {
              if (value === 'SELECCIONAR' || value === undefined) {
                return Promise.reject('Debe seleccionar una opción.')
              }
              return Promise.resolve()
            },
          },
        ]}
      >
        <Cascader
          ref={inputRef}
          onChange={save}
          onBlur={save}
          options={suppliedSchema}
        />
      </Form.Item>
    ) : (
      <div
        className="editable-cell-value-wrap"
        style={{ paddingRight: 24 }}
        onClick={toggleEdit}
      >
        {children}
      </div>
    )
  } else if (editable) {
    childNode = editing ? (
      <Form.Item
        style={{ margin: 0 }}
        name={dataIndex}
        rules={[
          {
            required: true,
            message: 'Debe ingresar un número válido.',
          },
        ]}
      >
        <InputNumber
          style={{ width: 100 }}
          ref={inputRef}
          onPressEnter={save}
          onBlur={save}
          min={0.1}
          step={0.1}
        />
      </Form.Item>
    ) : (
      <div
        className="editable-cell-value-wrap"
        style={{ paddingRight: 24 }}
        onClick={toggleEdit}
      >
        {children}
      </div>
    )
  }

  return <td {...restProps}>{childNode}</td>
}

export default EditableCell
