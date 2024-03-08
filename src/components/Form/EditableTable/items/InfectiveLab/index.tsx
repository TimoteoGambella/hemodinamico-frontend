import { Button, Form, Modal, Table, Typography } from 'antd'
import { cultivoToCultivoForm } from '../../utils/refactors'
import { useCallback, useEffect, useState } from 'react'
import useMsgApi from '../../../../../hooks/useMsgApi'
import CultivoForm from './utils/CultivoForm'
import DeleteBtn from '../DeleteBtn'

type EditableTableProps = Parameters<typeof Table>[0]

type ColumnTypes = Exclude<EditableTableProps['columns'], undefined>

interface StretcherProps {
  data: CultivoFormType[]
  setData: (value: CultivoFormType[]) => void
}

export default function InfectiveLab({ data, setData }: StretcherProps) {
  const afterSave = useCallback(
    (newData: Cultivo[]) => {
      const res = cultivoToCultivoForm(newData)
      setData([...data, res[res.length - 1]])
    },
    [setData, data]
  )
  const [newCultivo, setNewCultivo] = useState<Cultivo | null>(null)
  const [form] = Form.useForm<Cultivo>()
  const [isOpen, setIsOpen] = useState(false)
  const msgApi = useMsgApi()

  const handleOk = async () => {
    try {
      await form.validateFields()

      const values = form.getFieldsValue()
      setNewCultivo(values)
      setIsOpen(false)
      form.resetFields()
    } catch (error) {
      msgApi.error('Corrija los campos resaltados.')
    }
  }

  const handleDelete = (key: React.Key) => {
    const newData = data.filter((item) => item.key !== key)
    setData(newData)
  }

  const columns: (ColumnTypes[number] & {
    dataIndex: string
  })[] = [
    {
      title: 'CULTIVO',
      dataIndex: 'cultivo',
      width: '25%',
    },
    {
      title: 'RESULTADO',
      dataIndex: 'resultado',
    },
    {
      title: 'GERMEN',
      dataIndex: 'germen',
    },
    {
      title: 'ELIMINAR',
      dataIndex: 'operation',
      render: (_, record) => (
        <DeleteBtn
          dataSource={data}
          record={record as CultivoFormType}
          handleDelete={handleDelete}
        />
      ),
    },
  ]

  const handleAdd = useCallback(() => {
    if (data.length >= 4) {
      msgApi.warning('Alcanzó el límite de cultivos aplicables por paciente.')
      return
    }
    const newData = {
      key: data.length,
      ...newCultivo,
    } as unknown as CultivoFormType

    setNewCultivo(null)
    afterSave([...data, newData] as unknown as Cultivo[])
  }, [data, msgApi, newCultivo, afterSave])

  useEffect(() => {
    if (!newCultivo) return
    handleAdd()
  }, [newCultivo, handleAdd])

  return (
    <>
      <Typography.Title level={4}>CULTIVOS Y RESULTADOS</Typography.Title>
      <Button
        onClick={() => setIsOpen(!isOpen)}
        type="primary"
        style={{ marginBottom: 16 }}
      >
        Agregar
      </Button>
      <Modal
        title="Registrar resultado de cultivo"
        open={isOpen}
        onOk={handleOk}
        onCancel={() => setIsOpen(false)}
      >
        <CultivoForm form={form} />
      </Modal>
      <Table
        bordered
        dataSource={data}
        columns={columns}
        style={{ marginBottom: '1rem' }}
      />
    </>
  )
}
