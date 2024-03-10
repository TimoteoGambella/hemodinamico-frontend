import { useCallback, useEffect, useState } from 'react'
import * as ctrl from './controllers/trends.controller'
import { Bar, Line, YAxis } from 'recharts'
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
  const [LP2, setLP2] = useState<LiverProfile['bilirrubina'][]>([])
  const [HB2, setHB2] = useState<{ plaquetas: number }[]>([])
  const [LP1, setLP1] = useState<LiverProfile[]>([])
  const [CP, setCP] = useState<CardiacProfile[]>([])
  const [HB1, setHB1] = useState<Hematology[]>([])
  const [INF, setINF] = useState<Infective[]>([])
  const [KP, setKP] = useState<Kidney[]>([])

  const getValueOf = useCallback(
    (key: keyof LaboratoryData) => {
      if (!versions) throw new Error('No versions initialized')
      return versions.map((version) => {
        return version[key]
      })
    },
    [versions]
  )

  useEffect(() => {
    if (!versions) return
    setCP(getValueOf('cardiac_profile') as CardiacProfile[])
    setLP1(getValueOf('liver_profile') as LiverProfile[])
    setHB1(getValueOf('hematology') as Hematology[])
    ctrl.initializeHB2({ versions, setter: setHB2 })
    ctrl.initializeLP2({ versions, setter: setLP2 })
    setINF(getValueOf('infective') as Infective[])
    ctrl.initializeKP({
      versions,
      setter: setKP,
      kidney: getValueOf('kidney') as Kidney[],
    })
  }, [getValueOf, versions])

  return (
    <Flex wrap="wrap" justify="center">
      <Graphs.Bar
        title="HEMATOLOGÍA I: HB, LEUCOCITOS, COAGULACIÓN"
        data={HB1}
        currentTab={currentTab}
        yAxis={<YAxis yAxisId="right" orientation="right" stroke="#ffc658" />}
      >
        <Bar dataKey="hemoglobina" fill="#8884d8" />
        <Bar dataKey="leucocitos" fill="#82ca9d" />
        <Bar dataKey="TPA" fill="#54c2b9" />
        <Bar yAxisId="right" dataKey="INR" fill="#ffc658" />
      </Graphs.Bar>

      <Graphs.Line
        title="HEMATOLOGÍA II: PLAQUETAS"
        data={HB2}
        currentTab={currentTab}
      >
        <Line dataKey="plaquetas" stroke="#8884d8" />
      </Graphs.Line>

      <Graphs.Line
        title="PERFIL HEPÁTICO I: TRANSAMINASAS, FA, ALBUMINA"
        data={LP1}
        currentTab={currentTab}
      >
        <Line dataKey="TGO" stroke="#8884d8" />
        <Line dataKey="TGP" stroke="#82ca9d" />
        <Line dataKey="albumina" stroke="#54c2b9" />
        <Line dataKey="fosfatasa" stroke="#ffc658" />
      </Graphs.Line>

      <Graphs.Line
        title="PERFIL HEPÁTICO II: BILIRRUBINAS"
        data={LP2}
        currentTab={currentTab}
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

      <Graphs.Bar
        title="INFLAMATORIO / INFECCIOSO"
        data={INF}
        currentTab={currentTab}
        yAxis={
          <>
            <YAxis
              style={{ transform: 'translateX(59px)' }}
              yAxisId="left"
              orientation="left"
              stroke="#8884d8"
            />
            <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
          </>
        }
      >
        <Bar yAxisId="left" dataKey="proteinaC" fill="#8884d8" />
        <Bar yAxisId="right" dataKey="procalcitonina" fill="#82ca9d" />
      </Graphs.Bar>
    </Flex>
  )
}
