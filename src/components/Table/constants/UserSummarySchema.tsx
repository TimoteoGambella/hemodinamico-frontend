import { PatientWithKey } from '../components/UserSummaryTable'
import routeSchema from '../../App/constants/routeSchema'
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
    render: (_, record: PatientWithKey) => {
      const stretcher = record.stretcherId as StretcherData
      if (!stretcher || !stretcher.label) return 'N/A'
      return <Link to={`${routeSchema.stretchers.path}/${stretcher._id}`}>{stretcher.label}</Link>
    },
  },
] as TableSchema<PatientWithKey>[]
