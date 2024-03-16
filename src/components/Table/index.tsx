import MontoringSummary from './components/MontoringSummary'
import UserSummaryTable from './components/UserSummaryTable'
import DefaultTable from './components/DefaultTable'
import './style.css'

export default function CustomTable(children: React.ReactNode) {
  return <>{children}</>
}

CustomTable.User = UserSummaryTable
CustomTable.Monitoring = MontoringSummary
CustomTable.Default = DefaultTable

