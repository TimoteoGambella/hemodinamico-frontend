/* eslint-disable @typescript-eslint/no-explicit-any */
import { TableColumnsType } from 'antd'
import LabSummarySchema from './LabSummarySchema'
import useStretchers from '../../../hooks/useStretchers'

type SchemaType = LaboratoryData & { key: React.Key }

const LabReportSchema: TableColumnsType<SchemaType> = [
  {
    title: 'PACIENTE',
    dataIndex: 'patientId',
    key: 'patient',
    children: [
      {
        title: 'Nombre completo',
        dataIndex: ['patientId', 'fullname'],
        width: 200,
        key: 'patientName',
      },
      {
        title: 'DNI',
        dataIndex: ['patientId', 'dni'],
        width: 90,
        key: 'dni',
      },
      {
        title: 'Sexo',
        dataIndex: ['patientId', 'gender'],
        width: 90,
        key: 'gender',
        render: (gender) => (gender === 'M' ? 'Masculino' : 'Femenino'),
      },
      {
        title: 'Edad',
        dataIndex: ['patientId', 'age'],
        width: 60,
        key: 'age',
      },
      {
        title: 'Cama',
        dataIndex: ['patientId', 'stretcherId'],
        key: 'stretcher',
        width: 100,
        render: (stretcherId) => <Test id={stretcherId} />,
      },
      {
        title: 'Fecha de creación',
        dataIndex: 'createdAt',
        width: 150,
        children: [
          {
            title: 'Fecha',
            dataIndex: 'createdAt',
            key: 'createdDate',
            width: 100,
            render: (value) => new Date(value).toLocaleDateString(),
          },
          {
            title: 'Hora',
            dataIndex: 'createdAt',
            key: 'createdTime',
            width: 100,
            render: (value) => new Date(value).toLocaleTimeString(),
          },
        ],
      },
      {
        title: 'Peso',
        dataIndex: ['patientId', 'weight'],
        key: 'weight',
        width: 70,
      },
      {
        title: 'Talla',
        dataIndex: ['patientId', 'height'],
        key: 'height',
        width: 70,
      },
      {
        title: 'Grupo y factor',
        dataIndex: ['patientId', 'bloodType'],
        key: 'bloodType',
        width: 110,
      },
    ],
  },
  {
    title: 'Diagnostico',
    dataIndex: 'diagnostic',
    key: 'diagnostic',
    width: 150,
    children: [
      {
        title: 'Diagnostico 1',
        dataIndex: ['diagnostic', 'type'],
        key: 'diagnostic_type',
        width: 110,
        render: (type: string | null) => {
          if (!type) return 'N/A'
          return type.charAt(0).toUpperCase() + type.slice(1)
        },
      },
      {
        title: 'Diagnostico 2',
        dataIndex: ['diagnostic', 'subtype'],
        key: 'diagnostic_subtype',
        width: 110,
        render: (type: string | null) => {
          if (!type) return 'N/A'
          return type.charAt(0).toUpperCase() + type.slice(1)
        },
      },
      {
        title: 'Diagnostico 3',
        dataIndex: ['diagnostic', 'child'],
        key: 'diagnostic_child',
        width: 110,
        render: (type: string | null) => {
          if (!type) return 'N/A'
          return type.charAt(0).toUpperCase() + type.slice(1)
        },
      },
      {
        title: 'FEVI',
        dataIndex: ['diagnostic', 'FEVI'],
        key: 'FEVI',
        width: 110,
        render: (type: string | null) => {
          if (!type) return 'N/A'
          return type.charAt(0).toUpperCase() + type.slice(1)
        },
      },
    ],
  },
]

LabReportSchema.push(...LabSummarySchema.slice(2))

function Test({ id }: { id: string }) {
  const label = useStretchers()?.find(
    (stretcher) => stretcher._id === id
  )?.label
  return label || 'N/A'
}

export default LabReportSchema
