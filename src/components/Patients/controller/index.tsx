import { TableProps } from 'antd'
import ActionRender from './ActionRender'

interface GetColumnsProps {
  setShouldGetUsers: React.Dispatch<React.SetStateAction<boolean>>
}

export function getColumns({ setShouldGetUsers }: GetColumnsProps): TableProps<PatientData>['columns'] {
  return [
    {
      title: 'DNI',
      dataIndex: 'dni',
      key: 'dni',
      render: (text) => <a>{text}</a>,
    },
    {
      title: 'Nombre completo',
      dataIndex: 'fullname',
      key: 'fullname',
    },
    {
      title: 'Sexo',
      dataIndex: 'gender',
      key: 'gender',
      render: (text) => (text === 'M' ? 'Masculino' : 'Femenino'),
    },
    {
      title: 'Edad',
      key: 'age',
      dataIndex: 'age',
    },
    {
      title: 'Talla',
      key: 'height',
      dataIndex: 'height',
      render: (text) => text + ' cm',
    },
    {
      title: 'Peso',
      key: 'weight',
      dataIndex: 'weight',
      render: (text) => text + ' kg',
    },
    {
      title: 'Acciones',
      key: 'action',
      width: 265,
      render: (_, data) => {
        return (
          <ActionRender data={data._id} setShouldGetUsers={setShouldGetUsers} />
        )
      },
    },
  ]
}
