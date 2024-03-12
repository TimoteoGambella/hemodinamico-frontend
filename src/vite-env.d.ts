/// <reference types="vite/client" />

type FormLogin = {
  username: string
  password: string
}

type MenuItem = {
  key: React.Key
  label: React.ReactNode
  icon?: React.ReactNode
  children?: MenuItem[]
}

type UserData = {
  _id: string
  name: string
  lastName: string
  username: string
  isAdmin: boolean
  timestamp: number
}

type AuthUserData = Omit<UserData, 'timestamp'>

type PatientData = {
  _id: string
  stretcherId: string | null | undefined
  laboratoryId: string | null | undefined
  gender: 'M' | 'F'
  fullname: string
  height: number
  weight: number
  age: number
  dni: number
  bloodType: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-'
  createdAt: number
  editedAt: number | null
  editedBy: string | null
  isDeleted: boolean
  __v: number
}

interface GasometricSamples {
  vena: {
    sat: number | null
    pC02: number | null
  }
  arteria: {
    sat: number | null
    pC02: number | null
    lactato: number | null
  }
}

interface IndirectFick {
  hemoglobina: number | null
  consumo: number | null
  diferencia: number | null
  contenido: {
    ap: number | null
    ao: number | null
  }
  capacidad: number | null
  gasto: number | null
  indice: number | null
}

interface ArteryCatheter {
  presion: {
    AD: number | null
    capilar: number | null
    mediaSistemica: number | null
  }
  PAP: {
    sistolica: number | null
    diastolica: number | null
  }
  gasto: number | null
}

type DrugNames =
  | 'noradrenalina'
  | 'vasopresina'
  | 'adrenalina'
  | 'dobutamina'
  | 'dopamina'
  | 'levosimendan'
  | 'nitroglicerina'
  | 'nitroprusiato'

interface SuppliedDrugs {
  name: DrugNames
  dose: number
}

interface Supplied {
  drogas: SuppliedDrugs[]
}

type StretcherData = {
  _id: string
  label: string | null
  patientId: string | PatientData | null
  patientHeartRate: number | null
  muestra: GasometricSamples
  cateter: ArteryCatheter
  suministros: Supplied
  fick: IndirectFick
  aid: ('ecmo' | 'balon')[] | null
  diagnostic: {
    type: 'shock_isq' | 'shock' | 'falla_avanzada' | '' | null
    subtype: 'intermacs_1' | 'intermacs_2' | 'intermacs_3' | null
  }
  timestamp: number
}

type FormPropType = {
  shouldSubmit: boolean
  status: 'ok' | 'form-error' | 'loading' | 'initial' | 'server-error'
  message: string | null
  enable: boolean
  setFormProp?: React.Dispatch<React.SetStateAction<FormPropType>>
  handleUpdate?: React.Dispatch<React.SetStateAction>
}

interface IconAssetsProps {
  width?: string | number | undefined
  height?: string | number | undefined
  style?: React.CSSProperties | undefined
}

interface Hematology {
  hemoglobina: number | null
  plaquetas: number | null
  leucocitos: number | null
  bastones: number | null
  segmentados: number | null
  INR: number | null
  protrombina: number | null
  TPA: number | null
}

interface LiverProfile {
  TGO: number | null
  TGP: number | null
  albumina: number | null
  fosfatasa: number | null
  bilirrubina: {
    total: number | null
    directa: number | null
  }
}

interface CardiacProfile {
  troponina: number | null
  CPK: number | null
  PRO: number | null
  CA125: number | null
}

type Cultivo = {
  cultivo: 'hemocultivo' | 'urocultivo' | 'cultivo de secreción'
  resultado: boolean | 'true' | 'false'
  germen: string | null
}

interface CultivoFormType {
  [x: string]: unknown
  key: number
  cultivo: 'Hemocultivo' | 'Urocultivo' | 'Cultivo de secreción'
  resultado: 'POSITIVO' | 'NEGATIVO'
  germen: string
}

interface Infective {
  proteinaC: number | null
  procalcitonina: number | null
  cultivos: Cultivo[]
}

interface Kidney {
  urea: number | null
  creatinina: number | null
}

interface Diagnostic {
  type: 'shock' | 'falla_cardiaca' | 'infarto' | 'valvular' | null
  subtype:
    | 'isquemico'
    | 'no_isquemico'
    | 'cronica'
    | 'FCAD'
    | 'aguda'
    | 'st_no_elevado'
    | 'st_elevado'
    | 'aortico'
    | 'mitral'
    | 'tricuspide'
    | null
  child:
    | 'isquemia'
    | 'no_isquemica'
    | 'anterior'
    | 'anterosepta'
    | 'inferior'
    | 'inf_post_la'
    | 'insuficiente'
    | 'estenosis'
    | 'doble_lesion'
    | null
  FEVI: '50' | '40-' | '40' | null
}

interface LaboratoryData {
  _id: string
  patientId: string | PatientData
  hematology: Hematology
  liver_profile: LiverProfile
  cardiac_profile: CardiacProfile
  diagnostic: Diagnostic
  infective: Infective
  kidney: Kidney
  editedBy: string
  editedAt: number | null
  createdAt: number
  __v: number
}

interface IStretcherFormType extends StretcherData {
  patientId: PatientData
  patientHeartRate: number
}

interface DataSourceType {
  key: React.Key
  name: SuppliedDrugs['name'] | 'SELECCIONAR'
  dose: SuppliedDrugs['dose']
}

type RecordWithKey = Record<string, unknown> & { key: React.Key }

type MarginProps = {
  top?: number
  right?: number
  left?: number
  bottom?: number
}

type GraphsProps = {
  title?: string
  width?: number
  height?: number
  margin?: MarginProps | ((props: MarginProps) => MarginProps)
  data: ObjectOnlyNumbers[]
  currentTab: string
  yAxisKey?: [string, ('left' | 'right')]
  yAxis?: React.ReactNode
  children: React.ReactNode
}

type CascaderOption = {
  value: string
  label: React.ReactNode
  children?: CascaderOption[]
}

type CreatedTypesOfLab = {
  patientId: PatientData
  hematology: Hematology
  liver_profile: LiverProfile
  cardiac_profile: CardiacProfile
  diagnostic: Diagnostic
  infective: Infective
  kidney: Kidney
}

type ObjectOnlyNumbers = {
  [key: string]: number
}

interface PopulatedStretcher extends Omit<StretcherData, 'patientId'> {
  patientId: PatientData | null
}
