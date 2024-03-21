import { LoadingOutlined } from '@ant-design/icons'
import LabSummarySchema from './LabSummarySchema'
import { useEffect, useState } from 'react'

/**
 * IMPORTANTE: CAMBIAR EL ESQUEMA IMPLICA VERIFICAR EL CORRECTO FUNCIONAMIENTO DE LA EXPORTACIÓN A PDF Y EXCEL
 */

type SchemaType = LaboratoryData & { key: React.Key }

export default function getLabReportSchema(stretchersVersions: StretcherData[]) {
  const LabReportSchema: TableSchema<SchemaType>[] = [
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
          render: (stretcherId) => <LabelRender id={stretcherId} versions={stretchersVersions} />,
        },
        {
          title: 'Fecha de creación',
          dataIndex: 'editedAt',
          width: 150,
          children: [
            {
              title: 'Fecha',
              dataIndex: 'editedAt',
              key: 'createdDate',
              width: 100,
              render: (value) => new Date(value).toLocaleDateString(),
            },
            {
              title: 'Hora',
              dataIndex: 'editedAt',
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
          render: (value: string | null) => {
            if (!value) return 'N/A'
            return value.charAt(0).toUpperCase() + value.slice(1)
          },
        },
        {
          title: 'Diagnostico 2',
          dataIndex: ['diagnostic', 'subtype'],
          key: 'diagnostic_subtype',
          width: 110,
          render: (value: string | null) => {
            if (!value) return 'N/A'
            return value.charAt(0).toUpperCase() + value.slice(1)
          },
        },
        {
          title: 'Diagnostico 3',
          dataIndex: ['diagnostic', 'child'],
          key: 'diagnostic_child',
          width: 110,
          render: (value: string | null) => {
            if (!value) return 'N/A'
            return value.charAt(0).toUpperCase() + value.slice(1)
          },
        },
        {
          title: 'FEVI',
          dataIndex: ['diagnostic', 'FEVI'],
          key: 'FEVI',
          width: 110,
          render: (value: string | null) => {
            if (!value) return 'N/A'
            return value.charAt(0).toUpperCase() + value.slice(1)
          },
        },
      ],
    },
  ]
  
  LabReportSchema.push(...LabSummarySchema.slice(2))
  return LabReportSchema
}

interface LabelRenderProps {
  id: string
  versions: StretcherData[]
}

// eslint-disable-next-line react-refresh/only-export-components
function LabelRender({ id, versions }: LabelRenderProps) {
  const [stretchers] = useState(versions)
  const [label, setLabel] = useState<string>()

  useEffect(() => {
    if (stretchers) {
      const txt = stretchers.find(
        (stretcher) => stretcher._id === id
      )?.label
      setLabel(txt || 'N/A')
    }
  }, [id, stretchers])

  return label ? label : <LoadingOutlined />
}
