import { suppliedSchema } from '../../../constants/suppliedSchemaDrugs'
import { Button, FormInstance, Table, Typography } from 'antd'
import { useCallback, useEffect, useState } from 'react'
import useMsgApi from '../../../../../hooks/useMsgApi'
import * as refactor from '../../utils/refactors'
import EditableCell from './utils/EditableCell'
import EditableRow from './utils/EditableRow'
import DeleteBtn from '../DeleteBtn'

type EditableTableProps = Parameters<typeof Table>[0]

type ColumnTypes = Exclude<EditableTableProps['columns'], undefined>

interface StretcherProps {
  form: FormInstance<StretcherData> & {
    customFields: {
      supplied: SuppliedDrugs[]
    }
  }
}

export default function StretcherDrugs({ form }: StretcherProps) {
  const [source, setSource] = useState<DataSourceType[] | null>(null)
  const msgApi = useMsgApi()

  const setValues = useCallback(
    (newData: DataSourceType[]) => {
      const value = refactor.tableValuesAsSupplied(newData)
      if (value instanceof Promise) return
      form.customFields.supplied = value
    },
    [form.customFields]
  )

  useEffect(() => {
    if (source) setValues(source)
  }, [source, setValues])

  useEffect(() => {
    if (!source) {
      setSource(refactor.suppliedToTableValuesType(form.customFields.supplied))
    }
  }, [form.customFields, source])

  if (!source) return null

  const handleDelete = (key: React.Key) => {
    const newData = source.filter((item) => item.key !== key)
    setSource(newData)
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
          const drug = item.children.find((child) => child.value === data.name)
          if (drug) {
            return drug.unidad
          }
        }
        return '-'
      },
    },
    {
      title: 'ELIMINAR',
      dataIndex: 'operation',
      render: (_, record) => (
        <DeleteBtn
          dataSource={source}
          record={record as RecordWithKey}
          handleDelete={handleDelete}
        />
      ),
    },
  ]

  const handleAdd = () => {
    if (source.length >= 4) {
      msgApi.warning('Alcanzó el límite de drogas aplicables por paciente.')
      return
    }
    const newData: DataSourceType = {
      name: 'SELECCIONAR',
      dose: 1,
      key: source.length,
    }
    setSource([...source, newData])
  }

  const handleSave = (row: DataSourceType) => {
    const newData = [...source]
    const index = newData.findIndex((item) => row.key === item.key)
    const item = newData[index]
    newData.splice(index, 1, {
      ...item,
      ...row,
    })
    newData.forEach((item) =>
      Array.isArray(item.name) ? (item.name = item.name[1]) : null
    )
    setSource(newData)
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
        pagination={false}
        components={components}
        dataSource={source}
        columns={columns as ColumnTypes}
        style={{ marginBottom: '1rem' }}
        rowClassName={() => 'editable-row'}
      />
    </>
  )
}
