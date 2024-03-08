import { Popconfirm } from 'antd'

interface DeleteBtnProps {
  record: RecordWithKey
  dataSource: Array<unknown>
  handleDelete: (key: React.Key) => void
}

const DeleteBtn = ({ dataSource, handleDelete, record }: DeleteBtnProps) =>
  dataSource.length >= 1 ? (
    <Popconfirm
      title="¿Estás seguro de eliminar?"
      onConfirm={() => handleDelete(record.key)}
    >
      <a>Eliminar</a>
    </Popconfirm>
  ) : null

export default DeleteBtn
