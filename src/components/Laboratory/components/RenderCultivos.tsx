import { Modal, Table, TableColumnsType } from 'antd'
import { useEffect, useState } from 'react'

export default function RenderCultivos({ cultivos }: { cultivos: Cultivo[] }) {
  const [isOpen, setIsOpen] = useState(false)
  const [cultivosWithKey, setCultivosWithKey] = useState<(Cultivo & { key: React.Key })[]>([])
  const child_columns: TableColumnsType<Cultivo & { key: React.Key }> = [
    {
      title: 'Cultivo',
      dataIndex: 'cultivo',
      key: 'cultivo',
      render: (cultivo: string) =>
        cultivo.charAt(0).toUpperCase() + cultivo.slice(1),
      width: 150,
    },
    {
      title: 'Resultado',
      dataIndex: 'resultado',
      key: 'resultado',
      render: (resultado: boolean) => (resultado ? 'POSITIVO' : 'NEGATIVO'),
      width: 150,
    },
    {
      title: 'Germen',
      dataIndex: 'germen',
      key: 'germen',
      render: (germen: string | null) => (germen ? germen : '-'),
      width: 150,
    },
  ]

  useEffect(() => {
    if (cultivos) {
      const res = cultivos.map((cultivo, index) => ({
        ...cultivo,
        key: index,
      }))
      setCultivosWithKey(res)
    }
  }, [cultivos])

  return (
    <>
      <a onClick={() => setIsOpen(!isOpen)}>Ver cultivos</a>
      <Modal
        className="modal-no-pd"
        open={isOpen}
        onCancel={() => setIsOpen(false)}
        footer={null}
      >
        <Table
          pagination={false}
          dataSource={cultivosWithKey}
          columns={child_columns}
        />
      </Modal>
    </>
  )
}
