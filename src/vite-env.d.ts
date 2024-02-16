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
  stretcherId: string | undefined
  gender: 'M' | 'F'
  fullname: string
  height: number
  weight: number
  age: number
  dni: number
  timestamp: number
}

type StretcherData = {
  _id: string
  label: string | null
  patientId: string | PatientData | null
  timestamp: number
}

type FormPropType = {
  shouldSubmit: boolean
  status: 'ok' | 'form-error' | 'loading' | 'initial' | 'server-error'
  message: string | null
  setFormProp?: React.Dispatch<React.SetStateAction<FormPropType>>
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
    indirecta: number | null
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
  resultado: boolean | null
  germen: string | null
}

interface Kidney {
  urea: number | null
  creatinina: number | null
  TFG: number | null
}

interface Diagnostic {
  type: 'shock' | 'falla cardíaca' | 'infarto' | 'valvular' | null
  subtype: {
    type:
      | 'isquémico'
      | 'no isquémico'
      | 'crónica'
      | 'f.c.a.d'
      | 'aguda'
      | 'st no elevado'
      | 'st elevado'
      | 'aórtico'
      | 'mitral'
      | 'tricúspide'
      | null

    subtype:
      | 'isquemia'
      | 'no isquemia'
      | 'anterior'
      | 'anterosepta'
      | 'inferior'
      | 'inf/post/la'
      | 'insuficiente'
      | 'estenosis'
      | 'doble lesión'
      | null
  }
  FEVI: '>50%' | '40-' | '<40%' | null
}

interface LaboratoryData {
  _id: string
  patientId: string | PatientData
  blood_type: string | null
  hematology: Hematology
  liver_profile: LiverProfile
  cardiac_profile: CardiacProfile
  infective: Infective
  kidney: Kidney
  timestamp: number
}