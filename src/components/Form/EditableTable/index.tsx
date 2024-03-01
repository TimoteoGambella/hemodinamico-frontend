import React from 'react'
import { Button, Table, Typography } from 'antd'
import useMsgApi from '../../../hooks/useMsgApi'
import EditableCell from './items/EditableCell'
import { suppliedSchema } from '../constants/suppliedSchemaDrugs'
import EditableRow from './items/EditableRow'
import DeleteBtn from './items/DeleteBtn'
import * as refactor from './utils/refactors'

type EditableTableProps = Parameters<typeof Table>[0]

export interface DataSourceType {
  key: React.Key
  name: SuppliedDrugs['name'] | 'SELECCIONAR'
  dose: SuppliedDrugs['dose']
}

type ColumnTypes = Exclude<EditableTableProps['columns'], undefined>

interface IProps {
  data: SuppliedDrugs[]
  setDataSource: (value: SuppliedDrugs[]) => void
}

const EditableTable = ({ data, setDataSource }: IProps) => {
  const msgApi = useMsgApi()
  const dataSource = refactor.suppliedToTableValuesType(data)
  const setValues = (newData: DataSourceType[]) => {
    const value = refactor.tableValuesAsSupplied(newData)
    if (value instanceof Promise) return
    setDataSource(value)
  }

  const handleDelete = (key: React.Key) => {
    const newData = dataSource.filter((item) => item.key !== key)
    setValues(newData)
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
        const data = record as Supplied['drogas'][number]
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
      render: (_, record) => (
        <DeleteBtn
          dataSource={dataSource}
          record={record as DataSourceType}
          handleDelete={handleDelete}
        />
      ),
    },
  ]

  const handleAdd = () => {
    if (dataSource.length >= 4) {
      msgApi.warning('Alcanzó el límite de drogas aplicables por paciente.')
      return
    }
    const newData: DataSourceType = {
      name: 'SELECCIONAR',
      dose: 1,
      key: dataSource.length,
    }
    setValues([...dataSource, newData])
  }

  const handleSave = (row: DataSourceType) => {
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
    setValues(newData)
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
      onCell: (record: Supplied['drogas'][number]) => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        handleSave,
      }),
    }
  })

  return (
    <>
      <Typography.Title level={4}>DROGAS SUMINISTRADAS</Typography.Title>
      <Button onClick={handleAdd} type="primary" style={{ marginBottom: 16 }}>
        Agregar
      </Button>
      <Table
        bordered
        components={components}
        dataSource={dataSource}
        columns={columns as ColumnTypes}
        style={{ marginBottom: '1rem' }}
        rowClassName={() => 'editable-row'}
      />
    </>
  )
}

export default EditableTable
