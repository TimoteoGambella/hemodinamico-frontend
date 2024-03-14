/* eslint-disable @typescript-eslint/no-explicit-any */
import RenderCultivos from '../../Laboratory/components/RenderCultivos'
import { calcTFG } from '../../Form/utils/formulas'
import { TableColumnsType } from 'antd'

type SchemaType = LaboratoryData & { key: React.Key }
type LabKeys = keyof LaboratoryData | string

function sortNums( a: SchemaType | number, b: SchemaType | number, key?: LabKeys[]) {
  let firstValue: any = a
  let secondValue: any = b

  if (!key) {
    if (typeof a === 'number' && typeof b === 'number') return a - b
    else return 0
  }

  for (const k of key) {
    if (firstValue && firstValue[k] !== null) {
      firstValue = firstValue[k]
    } else {
      firstValue = null
      break
    }
  }

  for (const k of key) {
    if (secondValue && secondValue[k] !== null) {
      secondValue = secondValue[k]
    } else {
      secondValue = null
      break
    }
  }

  if (firstValue === null || secondValue === null) {
    return 0
  }

  const result = Number(firstValue) - Number(secondValue)
  return isNaN(result) ? 0 : result
}

const SummarySchema: TableColumnsType<SchemaType> = [
  {
    title: 'Fecha de creación',
    dataIndex: 'createdAt',
    key: 'createdAt',
    width: 100,
    fixed: 'left',
    render: (value) => new Date(value).toLocaleDateString(),
  },
  {
    title: 'Servicio',
    dataIndex: 'editedAt',
    key: 'editedAt',
    width: 150,
    fixed: 'left',
    render: (value) => new Date(value).toLocaleString(),
    sorter: (a: SchemaType, b: SchemaType) => sortNums(a, b, ['editedAt']),
  },
  {
    title: 'HEMATOLOGÍA Y COAGULACIÓN',
    children: [
      {
        title: 'Hemoglobina (g/dl)',
        dataIndex: ['hematology', 'hemoglobina'],
        key: 'hemoglobina',
        width: 160,
        render: (value) => value ?? '-',
        sorter: (a, b) => sortNums(a, b, ['hematology', 'hemoglobina']),
      },
      {
        title: 'Plaquetas (10³ x mm³)',
        dataIndex: ['hematology', 'plaquetas'],
        key: 'plaquetas',
        width: 180,
        render: (value) => value ?? '-',
        sorter: (a, b) => sortNums(a, b, ['hematology', 'plaquetas']),
      },
      {
        title: 'Leucocitos (10³ x mm³)',
        dataIndex: ['hematology', 'leucocitos'],
        key: 'leucocitos',
        width: 180,
        render: (value) => value ?? '-',
        sorter: (a, b) => sortNums(a, b, ['hematology', 'leucocitos']),
      },
      {
        title: 'Bastones (%)',
        dataIndex: ['hematology', 'bastones'],
        key: 'bastones',
        width: 120,
        render: (value) => value ?? '-',
        sorter: (a, b) => sortNums(a, b, ['hematology', 'bastones']),
      },
      {
        title: 'Segmentados (%)',
        dataIndex: ['hematology', 'segmentados'],
        key: 'segmentados',
        width: 150,
        render: (value) => value ?? '-',
        sorter: (a, b) => sortNums(a, b, ['hematology', 'segmentados']),
      },
      {
        title: 'I.N.R',
        dataIndex: ['hematology', 'INR'],
        key: 'INR',
        width: 70,
        render: (value) => value ?? '-',
        sorter: (a, b) => sortNums(a, b, ['hematology', 'INR']),
      },
      {
        title: 'T. Protrombina (Seg)',
        dataIndex: ['hematology', 'protrombina'],
        key: 'protrombina',
        width: 170,
        render: (value) => value ?? '-',
        sorter: (a, b) => sortNums(a, b, ['hematology', 'protrombina']),
      },
      {
        title: 'T. TPA (seg)',
        dataIndex: ['hematology', 'TPA'],
        key: 'TPA',
        width: 110,
        render: (value) => value ?? '-',
        sorter: (a, b) => sortNums(a, b, ['hematology', 'TPA']),
      },
    ],
  },
  {
    title: 'PERFIL HEPÁTICO',
    children: [
      {
        title: 'TGO (U/L)',
        dataIndex: ['liver_profile', 'TGO'],
        key: 'TGO',
        width: 100,
        render: (value) => value ?? '-',
        sorter: (a, b) => sortNums(a, b, ['liver_profile', 'TGO']),
      },
      {
        title: 'TGP (U/L)',
        dataIndex: ['liver_profile', 'TGP'],
        key: 'TGP',
        width: 100,
        render: (value) => value ?? '-',
        sorter: (a, b) => sortNums(a, b, ['liver_profile', 'TGP']),
      },
      {
        title: 'Albumina (g/dl)',
        dataIndex: ['liver_profile', 'albumina'],
        key: 'albumina',
        width: 140,
        render: (value) => value ?? '-',
        sorter: (a, b) => sortNums(a, b, ['liver_profile', 'albumina']),
      },
      {
        title: 'Bilirrubina total (mg/dL)',
        dataIndex: ['liver_profile', 'bilirrubina', 'total'],
        key: 'bilirrubina_total',
        width: 190,
        render: (value) => value ?? '-',
        sorter: (a, b) =>
          sortNums(a, b, ['liver_profile', 'bilirrubina', 'total']),
      },
      {
        title: 'B. directa (mg/dL)',
        dataIndex: ['liver_profile', 'bilirrubina', 'directa'],
        key: 'bilirrubina_directa',
        width: 150,
        render: (value) => value ?? '-',
        sorter: (a, b) =>
          sortNums(a, b, ['liver_profile', 'bilirrubina', 'directa']),
      },
      {
        title: 'B. indirecta (mg/dL)',
        render: (_, record) => {
          const total = record.liver_profile.bilirrubina.total ?? '-'
          const directa = record.liver_profile.bilirrubina.directa ?? '-'
          const res = Number(total) - Number(directa)
          return !isNaN(res) ? res.toFixed(2) : '-'
        },
        key: 'age',
        width: 160,
        sorter: (a, b) =>
          sortNums(a, b, ['liver_profile', 'bilirrubina', 'total']),
      },
      {
        title: 'Fosfatasa alcalina (U/L)',
        dataIndex: ['liver_profile', 'fosfatasa'],
        key: 'fosfatasa',
        width: 180,
        render: (value) => value ?? '-',
        sorter: (a, b) => sortNums(a, b, ['liver_profile', 'fosfatasa']),
      },
    ],
  },
  {
    title: 'PERFIL CARDÍACO',
    children: [
      {
        title: 'Troponina T (ng/mL)',
        dataIndex: ['cardiac_profile', 'troponina'],
        key: 'age',
        width: 150,
        render: (value) => value ?? '-',
        sorter: (a, b) => sortNums(a, b, ['cardiac_profile', 'troponina']),
      },
      {
        title: 'CPK-MB (U/L)',
        dataIndex: ['cardiac_profile', 'CPK'],
        key: 'age',
        width: 110,
        render: (value) => value ?? '-',
        sorter: (a, b) => sortNums(a, b, ['cardiac_profile', 'CPK']),
      },
      {
        title: 'PRO-BNP',
        dataIndex: ['cardiac_profile', 'PRO'],
        key: 'age',
        width: 90,
        render: (value) => value ?? '-',
        sorter: (a, b) => sortNums(a, b, ['cardiac_profile', 'PRO']),
      },
      {
        title: 'CA125',
        dataIndex: ['cardiac_profile', 'CA125'],
        key: 'age',
        width: 70,
        render: (value) => value ?? '-',
        sorter: (a, b) => sortNums(a, b, ['cardiac_profile', 'CA125']),
      },
    ],
  },
  {
    title: 'INFLAMATORIO / INFECCIOSO',
    children: [
      {
        title: 'Proteina C reactiva',
        dataIndex: ['infective', 'proteinaC'],
        key: 'proteinaC',
        width: 155,
        render: (value) => value ?? '-',
        sorter: (a, b) => sortNums(a, b, ['infective', 'proteinaC']),
      },
      {
        title: 'Procalcitonina',
        dataIndex: ['infective', 'procalcitonina'],
        key: 'procalcitonina',
        width: 125,
        render: (value) => value ?? '-',
        sorter: (a, b) => sortNums(a, b, ['infective', 'procalcitonina']),
      },
      {
        title: 'Cultivos',
        dataIndex: ['infective', 'cultivos'],
        width: 100,
        render: (cultivos: Cultivo[]) => <RenderCultivos cultivos={cultivos} />,
      },
    ],
  },
  {
    title: 'PERFIL RENAL',
    children: [
      {
        title: 'Urea (mg/dL)',
        dataIndex: ['kidney', 'urea'],
        key: 'urea',
        width: 120,
        render: (value) => value ?? '-',
        sorter: (a, b) => sortNums(a, b, ['kidney', 'urea']),
      },
      {
        title: 'Creatinina (mg/dL)',
        dataIndex: ['kidney', 'creatinina'],
        key: 'creatinina',
        width: 160,
        render: (value) => value ?? '-',
        sorter: (a, b) => sortNums(a, b, ['kidney', 'creatinina']),
      },
      {
        title: 'T.F.G (C-G)',
        key: 'age',
        width: 100,
        render: (_, record) => {
          const patient = record.patientId as PatientData
          const res = calcTFG(
            patient.gender,
            record.kidney.creatinina!,
            patient.age,
            patient.weight
          )
          return isFinite(res) ? res : '-'
        },
        sorter: (a, b) => {
          const first_patient = a.patientId as PatientData
          const second_patient = b.patientId as PatientData

          const first_tfg = calcTFG(
            first_patient.gender,
            a.kidney.creatinina!,
            first_patient.age,
            first_patient.weight
          )
          const second_tfg = calcTFG(
            second_patient.gender,
            b.kidney.creatinina!,
            second_patient.age,
            second_patient.weight
          )
          return sortNums(first_tfg, second_tfg)
        },
      },
    ],
  },
]

export default SummarySchema
