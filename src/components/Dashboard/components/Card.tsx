import AnimatedNumbers from 'react-animated-numbers'
import usePatients from '../../../hooks/usePatients'
import * as Ant from 'antd'
import Card from '../../Card'
import useLabs from '../../../hooks/useLabs'
import useStretchers from '../../../hooks/useStretchers'
import useUsers from '../../../hooks/useUsers'

interface CardProps {}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function CardList(_props: CardProps) {
  const stretchers = useStretchers()
  const patients = usePatients()
  const users = useUsers()
  const labs = useLabs()
  const style = {
    title: {
      display: 'flex',
      justifyContent: 'center',
    },
  }

  return (
    <Ant.Space size="large" className="dash-card-container" wrap>
      <Card
        title={
          <AnimatedNumbers
            transitions={(index) => ({
              duration: index + 0.3,
            })}
            animateToNumber={patients.length}
          />
        }
        style={style}
        text="Pacientes"
        color="rgb(236, 38, 38)"
        icon="patients"
      />

      <Card
        title={
          <AnimatedNumbers
            transitions={(index) => ({
              duration: index + 0.3,
            })}
            animateToNumber={labs.length}
          />
        }
        style={style}
        text="Laboratorios"
        color="rgb(236, 134, 38)"
        icon="flask"
      />

      <Card
        title={
          <AnimatedNumbers
            transitions={(index) => ({
              duration: index + 0.3,
            })}
            animateToNumber={stretchers?.length ?? 0}
          />
        }
        style={style}
        text="Camas"
        color="rgb(91, 38, 236)"
        icon="stretcher"
      />

      <Card
        title={
          <AnimatedNumbers
            transitions={(index) => ({
              duration: index + 0.3,
            })}
            animateToNumber={users.length}
          />
        }
        style={style}
        text="Usuarios"
        color="rgb(38, 147, 236)"
        icon="user"
      />
    </Ant.Space>
  )
}
