import useStretchers from '../../hooks/useStretchers'
import usePatients from '../../hooks/usePatients'
import useLabs from '../../hooks/useLabs'
import List from './components/ListNews'
import CardList from './components/Card'
import * as Ant from 'antd'
import './style.css'

const Dashboard = () => {
  const stretchers = useStretchers()
  const patients = usePatients()
  const labs = useLabs()

  return (
    <>
      <Ant.Typography.Title
        level={2}
        title="Dashboard"
        style={{ textAlign: 'start', marginBottom: '1.5rem' }}
      >
        Dashboard
      </Ant.Typography.Title>
      <CardList />

      <Ant.Divider />

      <Ant.Flex justify='space-around' gap={10} wrap='wrap'>
        <List
          source={patients}
          header="Últimos pacientes editados"
          type="patients"
        />
        <List
          source={stretchers}
          header="Últimas camas editadas"
          type="stretchers"
        />
        <List
          source={labs}
          header="Últimos laboratorios editados"
          type="labs"
        />
      </Ant.Flex>
    </>
  )
}

export default Dashboard
