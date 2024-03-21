import { suppliedSchema } from '../../Form/constants/suppliedSchemaDrugs'
import { Modal, Table, TableColumnsType } from 'antd'
import { useEffect, useState } from 'react'

export default function RenderDrugs({ drugs }: { drugs: SuppliedDrugs[] }) {
  const [isOpen, setIsOpen] = useState(false)
  const [drugsWithKey, setDrugsWithKey] = useState<(SuppliedDrugs & { key: React.Key })[]>([])
  const child_columns: TableColumnsType<SuppliedDrugs & { key: React.Key }> = [
    {
      title: 'Droga',
      dataIndex: 'name',
      key: 'name',
      width: 150,
    },
    {
      title: 'Dosis',
      dataIndex: 'dose',
      key: 'dose',
      width: 150,
    },
    {
      title: 'Unidades',
      key: 'units',
      width: 150,
      render: (_, record) => {
        const data = record as Supplied['drogas'][number]
        for (const item of suppliedSchema) {
          const drug = item.children.find((child) => child.value === data.name)
          if (drug) {
            return drug.unidad
          }
        }
        return '-'
      }
    }
  ]

  useEffect(() => {
    if (drugs) {
      const res = drugs.map((drug, index) => ({
        ...drug,
        key: index,
      }))
      setDrugsWithKey(res)
    }
  }, [drugs])

  return (
    <>
      <a onClick={() => setIsOpen(!isOpen)}>Ver drogas</a>
      <Modal
        className="modal-no-pd"
        open={isOpen}
        onCancel={() => setIsOpen(false)}
        footer={null}
      >
        <Table
          pagination={false}
          dataSource={drugsWithKey}
          columns={child_columns}
        />
      </Modal>
    </>
  )
}
