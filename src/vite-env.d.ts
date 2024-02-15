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
}

type StretcherData = {
  _id: string
  label: string | null
  patientId: string | PatientData | null
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
