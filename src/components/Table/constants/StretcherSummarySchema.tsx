import RenderDrugs from '../../Stretcher/components/RenderDrugs'
import * as util from '../../../utils/formulas'
import { TableColumnsType, Tag } from 'antd'

type SchemaType = StretcherData & { key: React.Key }

const StretcherSummarySchema: TableColumnsType<SchemaType> = [
  {
    title: 'Fecha',
    dataIndex: 'editedAt',
    key: 'date',
    width: 100,
    fixed: 'left',
    render: (value) => new Date(value).toLocaleDateString(),
  },
  {
    title: 'Hora',
    dataIndex: 'editedAt',
    key: 'time',
    width: 100,
    fixed: 'left',
    render: (value) => new Date(value).toLocaleTimeString(),
  },
  {
    title: 'Presión AD',
    dataIndex: ['cateter', 'presion', 'AD'],
    key: 'rightPressure',
    width: 110,
    render: (value) => value || 'N/A',
  },
  {
    title: 'Presión Capilar',
    dataIndex: ['cateter', 'presion', 'capilar'],
    key: 'capillaryPressure',
    width: 130,
    render: (value) => value || 'N/A',
  },
  {
    title: 'Resistencia Sistémica (DYNAS)',
    dataIndex: 'resistenciaSistemica',
    width: 225,
    render: (_, record) => {
      return util.calcSysEndurance(
        record.cateter.presion.mediaSistemica ?? 0,
        record.cateter.presion.AD ?? 0,
        record.cateter.gasto ?? 0,
        'up'
      )
    },
  },
  {
    title: 'Gasto Cardíaco (TD)',
    dataIndex: ['cateter', 'gasto'],
    key: 'cardiacOutput',
    width: 160,
    render: (value) => value || 'N/A',
  },
  {
    title: 'Índice Cardíaco (TD)',
    key: 'cardiacIndex',
    width: 160,
    render: (_, record) => {
      const patient = record.patientId as PatientData
      return util.calcCardiacIndexTD(
        record.cateter.gasto ?? 0,
        patient.weight,
        patient.height
      )
    },
  },
  {
    title: 'Poder Cardíaco',
    key: 'cardiacPower',
    width: 130,
    render: (_, record) => {
      return util.calcCardiacPower(
        record.cateter.gasto ?? 0,
        record.cateter.PAP.sistolica ?? 0,
        record.cateter.PAP.diastolica ?? 0
      )
    },
  },
  {
    title: 'Índice de Poder Cardíaco',
    key: 'cardiacPowerIndex',
    width: 190,
    render: (_, record) => {
      const patient = record.patientId as PatientData
      return util.calcIndexedCardiacPower(
        record.cateter.gasto ?? 0,
        record.cateter.PAP.sistolica ?? 0,
        record.cateter.PAP.diastolica ?? 0,
        patient.weight,
        patient.height
      )
    },
  },
  {
    title: 'PAPi',
    key: 'PAPi',
    width: 65,
    render: (_, record) => {
      return util.calcPAPi(
        record.cateter.PAP.sistolica ?? 0,
        record.cateter.PAP.diastolica ?? 0,
        record.cateter.presion.AD ?? 0
      )
    },
  },
  {
    title: 'Drogas',
    dataIndex: ['suministros', 'drogas'],
    key: 'drugs',
    width: 100,
    render: (value) => <RenderDrugs drugs={value} />,
  },
  {
    title: 'Asistencia',
    dataIndex: 'aid',
    key: 'assistance',
    width: 170,
    render: (value) => (value as StretcherData['aid'])?.map((type) => (
      <Tag color={type === 'ecmo' ? 'blue' : 'red'} key={type}>
        {type.toUpperCase()}
      </Tag>
    )),
  }
]

export default StretcherSummarySchema
