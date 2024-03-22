import EditablePatientForm from './components/EditablePatientForm'
import StretcherForm from './components/StretcherForm'
import PatientForm from './components/PatientForm'
import UserForm from './components/UserForm'
import LabForm from './components/LabForm'
import './style.css'

export interface CustomFormProps {
  formProp: FormPropType
  data?: LaboratoryData | PatientData | StretcherData | PopulatedPatient
  onFieldsChange?: () => void
  onCancel?: () => void
}

export default function CustomForm(children: React.ReactNode) {
  return <>{children}</>
}

CustomForm.EditPatient = EditablePatientForm

CustomForm.Stretchers = StretcherForm

CustomForm.Patients = PatientForm

CustomForm.Laboratory = LabForm

CustomForm.User = UserForm
