import StretcherSummarySchema from './StretcherSummarySchema'
import * as util from '../../../utils/formulas'

/**
 * IMPORTANTE: CAMBIAR EL ESQUEMA IMPLICA VERIFICAR EL CORRECTO FUNCIONAMIENTO DE LA EXPORTACIÓN A PDF Y EXCEL
 */

type SchemaType = StretcherData & { key: React.Key }

/**
 *
 * @summary Esta función devuelve un obj para centrar el texto de las celdas de la tabla
 */
const textCenter = (): React.HTMLAttributes<HTMLTableCellElement> => ({
  style: { textAlign: 'center' },
})

const StretcherReportSchema: TableSchema<SchemaType>[] = [
  {
    title: 'CAMA',
    key: 'stretcher',
    children: [
      {
        title: 'Etiqueta',
        dataIndex: 'label',
        key: 'label',
        width: 130,
        onHeaderCell: textCenter,
      },
      {
        title: 'DIAGNOSTICOS',
        key: 'diagnostic',
        children: [
          {
            title: 'Diagnostico 1',
            dataIndex: ['diagnostic', 'type'],
            key: 'diagnostic1',
            width: 200,
            onHeaderCell: textCenter,
            render: (value: StretcherData['diagnostic']['type']) => {

              if (!value) return <>N/A</>

              if (value === 'falla_avanzada') {
                return <>FALLA AVANZADA</>
              } else if (value === 'shock') {
                return <>SHOCK CARDIOGENICO NO ISQUEMICO</>
              } else {
                return <>SHOCK CARDIOGENICO ISQUEMICO</>
              }
            },
          },
          {
            title: 'Diagnostico 2',
            dataIndex: ['diagnostic', 'subType'],
            key: 'diagnostic2',
            width: 200,
            onHeaderCell: textCenter,
            render: (value: StretcherData['diagnostic']['subtype']) => {
              if (!value) return <>N/A</>

              if (value === 'intermacs_1') {
                return <>INTERMACS I</>
              } else if (value === 'intermacs_2') {
                return <>INTERMACS II</>
              } else {
                return <>INTERMACS III</>
              }
            },
          },
        ],
      },
      {
        title: 'Fecha',
        dataIndex: 'editedAt',
        key: 'date',
        width: 100,
        onHeaderCell: textCenter,
        render: (value, record) => {
          if (!value) return new Date(record.createdAt).toLocaleDateString()
          return new Date(value).toLocaleDateString()
        },
      },
      {
        title: 'Hora',
        dataIndex: 'editedAt',
        key: 'time',
        width: 100,
        onHeaderCell: textCenter,
        render: (value, record) => {
          if (!value) return new Date(record.createdAt).toLocaleTimeString()
          return new Date(value).toLocaleTimeString()
        },
      },
      {
        title: 'PACIENTE',
        key: 'patient',
        children: [
          {
            title: 'Nombre completo',
            dataIndex: ['patientId', 'fullname'],
            key: 'fullname',
            onHeaderCell: textCenter,
            width: 200,
          },
          {
            title: 'DNI',
            dataIndex: ['patientId', 'dni'],
            key: 'dni',
            onHeaderCell: textCenter,
            width: 100,
          },
        ],
      },
    ],
  },
]

const newSchema = StretcherSummarySchema.slice(2)

newSchema.splice(3, 1) // Elimina el Gasto Cardiaco (TD) ya incluido de la tabla

let index = newSchema.findIndex((column) => column.title === 'Presión Capilar')
if (index !== -1) {
  newSchema.splice(
    index + 1,
    0,
    ...([
      {
        title: 'PAP',
        key: 'PAP',
        children: [
          {
            title: 'Sistólica de arteria pulmonar',
            dataIndex: ['cateter', 'PAP', 'sistolica'],
            key: 'systolicPAP',
            width: 100,
            onHeaderCell: textCenter,
            render: (value) => value ?? 'N/A',
          },
          {
            title: 'Diastólica de arteria pulmonar',
            dataIndex: ['cateter', 'PAP', 'diastolica'],
            key: 'dyastolicPAP',
            width: 100,
            onHeaderCell: textCenter,
            render: (value) => value ?? 'N/A',
          },
          {
            title: 'Media de arteria pulmonar',
            key: 'mediaPAP',
            width: 100,
            onHeaderCell: textCenter,
            render: (_, record) => {
              return util.calcAvgPAP(
                record.cateter.PAP.sistolica ?? 0,
                record.cateter.PAP.diastolica ?? 0
              )
            },
          },
        ],
      },
      {
        title: 'Presión media sistémica',
        dataIndex: ['cateter', 'presion', 'mediaSistemica'],
        key: 'systemicPressure',
        width: 200,
        render: (value) => value || 'N/A',
      },
      {
        title: 'Gasto Cardíaco (TD)',
        dataIndex: ['cateter', 'gasto'],
        key: 'cardiacOutput',
        width: 150,
        render: (value) => value || 'N/A',
      },
      {
        title: 'Gradiente TP',
        key: 'TPGradient',
        width: 110,
        render: (_, record) => {
          return util.calcTPGradient(
            record.cateter.PAP.sistolica ?? 0,
            record.cateter.PAP.diastolica ?? 0,
            record.cateter.presion.capilar ?? 0,
            'up'
          )
        },
      },
    ] as TableSchema<SchemaType>[])
  )
}
index = newSchema.findIndex((column) => column.title === 'Índice Cardíaco (TD)')
if (index !== -1) {
  newSchema.splice(
    index,
    0,
    ...([
      {
        title: 'Resistencia pulmonar (uW)',
        key: 'pulmonaryResistance',
        width: 190,
        render: (_, record) => {
          const val = util.calcPulmonaryResistance(
            record.cateter.PAP.sistolica ?? 0,
            record.cateter.PAP.diastolica ?? 0,
            record.cateter.presion.capilar ?? 0,
            record.cateter.gasto ?? 0,
            'down'
          )
          return isNaN(val) ? 'N/A' : val
        },
      },
    ] as TableSchema<SchemaType>[])
  )
}
newSchema[index + 3].title = 'Poder cardiaco indexado (iPC)'
newSchema[index + 3].width = 210
newSchema.splice(
  index + 5,
  0,
  ...([
    {
      title: 'PVC/PCP',
      key: 'PVC/PCP',
      width: 80,
      render: (_, record) => {
        const ad = Number(record.cateter.presion.AD)
        const capilar = Number(record.cateter.presion.capilar)
        if (isNaN(ad) || isNaN(capilar) || capilar === 0) return 'N/A'
        return (ad / capilar).toFixed(2)
      },
    },
    {
      title: 'iTSVD',
      key: 'iTSVD',
      width: 60,
      render: (_, record) => {
        const patient = record.patientId as PatientData
        const val = util.calcITSVD(
          record.cateter.PAP.sistolica ?? 0,
          record.cateter.PAP.diastolica ?? 0,
          record.cateter.presion.AD ?? 0,
          record.cateter.gasto ?? 0,
          patient.weight,
          patient.height,
          record.patientHeartRate ?? 0
        )
        return isNaN(val) ? 'N/A' : val
      },
    },
    {
      title: 'iTSVI',
      key: 'iTSVI',
      width: 60,
      render: (_, record) => {
        const patient = record.patientId as PatientData
        const val = util.calcITSVI(
          record.cateter.PAP.sistolica ?? 0,
          record.cateter.PAP.diastolica ?? 0,
          record.cateter.presion.capilar ?? 0,
          record.cateter.gasto ?? 0,
          patient.weight,
          patient.height,
          record.patientHeartRate ?? 0
        )
        return isNaN(val) ? 'N/A' : val
      },
    },
  ] as TableSchema<SchemaType>[])
)

StretcherReportSchema.push(...newSchema)

export default StretcherReportSchema
