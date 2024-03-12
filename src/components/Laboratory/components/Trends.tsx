import { handleSetter } from './controllers/trends.controller'
import * as ctrl from './controllers/trends.controller'
import { useEffect, useState } from 'react'
import { Line, YAxis } from 'recharts'
import Graphs from '../../Graph'
import { Flex } from 'antd'

interface TrendsProps {
  currentTab: string
  versions: LaboratoryData[] | null
}

export default function Trends({ versions, currentTab }: TrendsProps) {
  /**
   * HB: Hemoglobina
   * LP: Liver Profile
   * KP: Kidney Profile
   * CP: Cardiac Profile
   * INF: Infective
   */
  const [LP2, setLP2] = useState<ObjectOnlyNumbers[]>(new Array(39).fill(null))
  const [HB2, setHB2] = useState<ObjectOnlyNumbers[]>(new Array(39).fill(null))
  const [LP1, setLP1] = useState<ObjectOnlyNumbers[]>(new Array(39).fill(null))
  const [CP, setCP] = useState<ObjectOnlyNumbers[]>(new Array(39).fill(null))
  const [HB1, setHB1] = useState<ObjectOnlyNumbers[]>(new Array(39).fill(null))
  const [INF, setINF] = useState<ObjectOnlyNumbers[]>(new Array(39).fill(null))
  const [KP, setKP] = useState<ObjectOnlyNumbers[]>(new Array(39).fill(null))

  useEffect(() => {
    if (!versions) return
    const getValueOf = ctrl.initGetValueOf(versions)
    setLP1((prevLP1) =>
      handleSetter(
        prevLP1,
        getValueOf('liver_profile', ['TGO', 'TGP', 'albumina', 'fosfatasa'])
      )
    )
    setHB2((prevHB2) =>
      handleSetter(prevHB2, getValueOf('hematology', ['plaquetas']))
    )
    setCP((prevCP) =>
      handleSetter(
        prevCP,
        getValueOf('cardiac_profile', ['troponina', 'CPK', 'PRO'])
      )
    )
    setINF((prevINF) =>
      handleSetter(
        prevINF,
        getValueOf('infective', ['proteinaC', 'procalcitonina'])
      )
    )
    setHB1((prevHB1) =>
      handleSetter(
        prevHB1,
        getValueOf('hematology', ['hemoglobina', 'leucocitos', 'TPA', 'INR'])
      )
    )
    ctrl.initializeLP2({
      versions,
      setter: (newVal: ObjectOnlyNumbers[]) => {
        setLP2((prevLP2) => handleSetter(prevLP2, newVal))
      },
    })
    ctrl.initializeKP({
      kidney: getValueOf('kidney') as Kidney[],
      setter: (newValued: ObjectOnlyNumbers[]) => {
        setKP((prevKP) => handleSetter(prevKP, newValued))
      },
      versions,
    })
  }, [versions])

  return (
    <Flex wrap="wrap" justify="center">
      <Graphs.Line
        data={HB1}
        currentTab={currentTab}
        yAxisKey={['INR', 'right']}
        title="HEMATOLOGÍA I: HB, LEUCOCITOS, COAGULACIÓN"
        margin={(props) => ({ ...props, right: -25, left: 5 })}
        yAxis={<YAxis yAxisId="right" orientation="right" stroke="#ffc658" />}
      >
        <Line dataKey="hemoglobina" stroke="#8884d8" />
        <Line dataKey="leucocitos" stroke="#82ca9d" />
        <Line dataKey="TPA" stroke="#54c2b9" />
        <Line yAxisId="right" dataKey="INR" stroke="#ffc658" />
      </Graphs.Line>

      <Graphs.Line
        title="HEMATOLOGÍA II: PLAQUETAS"
        data={HB2}
        currentTab={currentTab}
      >
        <Line dataKey="plaquetas" stroke="#8884d8" />
      </Graphs.Line>

      <Graphs.Line
        data={LP1}
        currentTab={currentTab}
        title="PERFIL HEPÁTICO I: TRANSAMINASAS, FA, ALBUMINA"
      >
        <Line dataKey="TGO" stroke="#8884d8" />
        <Line dataKey="TGP" stroke="#82ca9d" />
        <Line dataKey="albumina" stroke="#54c2b9" />
        <Line dataKey="fosfatasa" stroke="#ffc658" />
      </Graphs.Line>

      <Graphs.Line
        data={LP2}
        currentTab={currentTab}
        title="PERFIL HEPÁTICO II: BILIRRUBINAS"
      >
        <Line dataKey="total" stroke="#8884d8" />
        <Line dataKey="directa" stroke="#82ca9d" />
        <Line dataKey="indirecta" stroke="#54c2b9" />
      </Graphs.Line>

      <Graphs.Line title="PERFIL RENAL" data={KP} currentTab={currentTab}>
        <Line dataKey="urea" stroke="#8884d8" />
        <Line dataKey="creatinina" stroke="#82ca9d" />
        <Line dataKey="TFG" stroke="#54c2b9" />
      </Graphs.Line>

      <Graphs.Line title="PERFIL CARDÍACO" data={CP} currentTab={currentTab}>
        <Line dataKey="troponina" stroke="#8884d8" />
        <Line dataKey="CPK" stroke="#82ca9d" />
        <Line dataKey="PRO" stroke="#54c2b9" />
      </Graphs.Line>

      <Graphs.Line
        data={INF}
        width={630}
        currentTab={currentTab}
        title="INFLAMATORIO / INFECCIOSO"
        yAxisKey={['procalcitonina', 'right']}
        yAxis={<YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />}
      >
        <Line dataKey="proteinaC" stroke="#8884d8" />
        <Line yAxisId="right" dataKey="procalcitonina" stroke="#82ca9d" />
      </Graphs.Line>
    </Flex>
  )
}
