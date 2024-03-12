import { ColumnsType } from 'antd/es/table'
import { PatientWithStretcher } from '..'
import { Link } from 'react-router-dom'

export default [
  {
    title: 'Nombre Completo',
    dataIndex: 'fullname',
    key: 'fullName',
  },
  {
    title: 'DNI',
    dataIndex: 'dni',
    key: 'dni',
  },
  {
    title: 'Cama',
    dataIndex: 'stretcherId',
    key: 'stretcher',
    render: (_, record: PatientWithStretcher) => {
      const stretcher = record.stretcherId as StretcherData
      if (!stretcher || !stretcher.label) return 'N/A'
      return <Link to={`/cama/${stretcher._id}`}>{stretcher.label}</Link>
    },
  },
] as ColumnsType<PatientWithStretcher>
