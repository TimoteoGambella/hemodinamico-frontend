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
  timestamp: number
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

interface Infective {
  proteinaC: number | null
  procalcitonina: number | null
  cultivo: 'hemocultivo' | 'urocultivo' | 'cultivo de secreción' | null
  resultado: boolean | string | null
  germen: string | null
}

interface Kidney {
  urea: number | null
  creatinina: number | null
  TFG: number | null
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
  timestamp: number
}
