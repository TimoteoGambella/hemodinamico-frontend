import UserSummaryTable from './components/UserSummaryTable'
import './style.css'

export default function CustomTable(children: React.ReactNode) {
  return <>{children}</>
}

export interface PatientWithStretcher extends Omit<PatientData, 'stretcherId'> {
  key: React.Key
  stretcherId: string | StretcherData | null
}


CustomTable.User = UserSummaryTable
