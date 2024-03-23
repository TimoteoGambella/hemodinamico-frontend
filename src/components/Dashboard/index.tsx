import useStretchers from '../../hooks/useStretchers'
import usePatients from '../../hooks/usePatients'
import logo from '../../assets/logo.webp'
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

      <Ant.Divider type="horizontal" />

      <Ant.Flex className="dash-botom-container">
        <Ant.Row gutter={[16, 16]}>
          <Ant.Col span={12} style={{minWidth: 300}}>
            <List
              source={patients}
              header="Últimos pacientes editados"
              type="patients"
            />
          </Ant.Col>

          <Ant.Col span={12} style={{minWidth: 300}}>
            <List
              source={stretchers}
              header="Últimas camas editadas"
              type="stretchers"
            />
          </Ant.Col>

          <Ant.Col span={12} style={{minWidth: 300}}>
            <List
              source={labs}
              header="Últimos laboratorios editados"
              type="labs"
            />
          </Ant.Col>
        </Ant.Row>
        <div className="dash-rigth-content">
          <Ant.Typography.Title level={4}>
            <span>SERVICIO DE CARDIOLOGÍA CLÍNICA</span>
            <br />
            <span>INSTITUTO NACIONAL CARDIOVASCULAR</span>
            <br />
            <span>UNIDAD DE CUIDADO CARDIACO CRITICO</span>
          </Ant.Typography.Title>
          <img className="logo" src={logo} width={'100%'} alt="logo" />
        </div>
      </Ant.Flex>
    </>
  )
}

export default Dashboard
