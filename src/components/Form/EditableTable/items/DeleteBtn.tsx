import { Popconfirm } from 'antd'
import { DataSourceType } from '..'

interface DeleteBtnProps {
  record: DataSourceType
  dataSource: DataSourceType[]
  handleDelete: (key: React.Key) => void
}

const DeleteBtn = ({ dataSource, handleDelete, record }: DeleteBtnProps) =>
  dataSource.length >= 1 ? (
    <Popconfirm
      title="¿Estás seguro de eliminar?"
      onConfirm={() => handleDelete(record.key as React.Key)}
    >
      <a>Eliminar</a>
    </Popconfirm>
  ) : null

export default DeleteBtn
