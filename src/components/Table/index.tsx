import UserSummaryTable from './components/UserSummaryTable'
import './style.css'

export default function CustomTable(children: React.ReactNode) {
  return <>{children}</>
}

CustomTable.User = UserSummaryTable
