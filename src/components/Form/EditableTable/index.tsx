import React from 'react'
import { Button, Popconfirm, Table } from 'antd'
import useMsgApi from '../../../hooks/useMsgApi'
import EditableCell from './items/EditableCell'
import { suppliedSchema } from '../constants/suppliedSchemaDrugs'
import EditableRow from './items/EditableRow'

type EditableTableProps = Parameters<typeof Table>[0]

export interface DataEditableType {
  key: React.Key
  name: Supplied["drogas"][number]["name"] | 'SELECCIONAR'
  dose: Supplied["drogas"][number]["dose"]
}

type ColumnTypes = Exclude<EditableTableProps['columns'], undefined>

interface IProps {
  dataSource: DataEditableType[]
  setDataSource: (value: DataEditableType[]) => void
}

const EditableTable = ({ dataSource, setDataSource }: IProps) => {
  const msgApi = useMsgApi()

  const handleDelete = (key: React.Key) => {
    const newData = dataSource.filter((item) => item.key !== key)
    setDataSource(newData)
  }

  const defaultColumns: (ColumnTypes[number] & {
    editable?: boolean
    dataIndex: string
  })[] = [
    {
      title: 'DROGAS',
      dataIndex: 'name',
      width: '25%',
      editable: true,
    },
    {
      title: 'DOSIS',
      dataIndex: 'dose',
      editable: true,
    },
    {
      title: 'UNIDADES',
      dataIndex: 'units',
      render: (_, record) => {
        const data = record as Supplied["drogas"][number]
        for (const item of suppliedSchema) {
          if (item.children.find((child) => child.value === data.name)) {
            return item.children.find((child) => child.value === data.name)
              ?.unidad
          }
        }
        return ''
      },
    },
    {
      title: 'ELIMINAR',
      dataIndex: 'operation',
      render: (_, record) =>
        dataSource.length >= 1 ? (
          <Popconfirm
            title="Sure to delete?"
            onConfirm={() => handleDelete(record.key as React.Key)}
          >
            <a>Delete</a>
          </Popconfirm>
        ) : null,
    },
  ]

  /*
   * TODO: Usar el msgApi cuando se quiere obtener los datos de la tabla si hay valores no seleccionados.
   * TODO: Conectar el componente con el formulario principal
   */

  const handleAdd = () => {
    if (dataSource.length >= 4) {
      msgApi.warning('Alcanzó el límite de drogas aplicables por paciente.')
      return
    }
    const newData: DataEditableType = {
      name: 'SELECCIONAR',
      dose: 1,
      key: dataSource.length,
    }
    setDataSource([...dataSource, newData])
  }

  const handleSave = (row: DataEditableType) => {
    const newData = [...dataSource]
    const index = newData.findIndex((item) => row.key === item.key)
    const item = newData[index]
    newData.splice(index, 1, {
      ...item,
      ...row,
    })
    newData.forEach((item) =>
      Array.isArray(item.name) ? (item.name = item.name[1]) : null
    )
    setDataSource(newData)
  }

  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  }

  const columns = defaultColumns.map((col) => {
    if (!col.editable) {
      return col
    }
    return {
      ...col,
      onCell: (record: Supplied["drogas"][number]) => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        handleSave,
      }),
    }
  })

  return (
    <div>
      <Button onClick={handleAdd} type="primary" style={{ marginBottom: 16 }}>
        Add a row
      </Button>
      <Table
        components={components}
        rowClassName={() => 'editable-row'}
        bordered
        dataSource={dataSource}
        columns={columns as ColumnTypes}
        style={{ marginBottom: '1rem' }}
      />
    </div>
  )
}

export default EditableTable
