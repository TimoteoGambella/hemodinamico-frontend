import { Space, TableProps } from 'antd'

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
      title: 'Camilla',
      key: 'stretcherId',
      dataIndex: 'stretcherId',
      render: (id) => {
        let style = undefined
        if (!id) style = { cursor: 'not-allowed', color: '#006aff8a' }
        return (<Space size="middle">
          <a href={`camilla/${id}`} style={style}>
            Ver camilla
          </a>
          <a href={`camilla/${id}`} style={style}>
            Más
          </a>
        </Space>)
      },
    },
  ]
}
