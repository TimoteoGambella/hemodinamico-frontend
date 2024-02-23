import { Space, TableProps } from 'antd'
import { Link } from 'react-router-dom'

export function getColumns(): TableProps<PatientData>['columns'] {
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
      width: 250,
      render: (_, data) => {
        return (
          <Space size="middle">
            {data.stretcherId ? (
              <Link to={`/camilla/${data.stretcherId}`}>Ver camilla</Link>
            ) : (
              <a onClick={() => console.log('click')}>Asignar camilla</a>
            )}
            {data.laboratoryId ? (
              <Link to={`/laboratorio/${data.laboratoryId}`}>
                Ver laboratorio
              </Link>
            ) : (
              <a onClick={() => console.log('click')}>Asignar a laboratorio</a>
            )}
          </Space>
        )
      },
    },
  ]
}
