/* eslint-disable @typescript-eslint/no-explicit-any */
import * as util from '../../../utils/formulas'
import { useEffect, useState } from 'react'
import { Line, YAxis } from 'recharts'
import Graphs from '../../Graph'
import { Flex } from 'antd'

interface TrendsProps {
  versions: StretcherData[] | null
  currentTab: string
}

export default function Trends({ versions, currentTab }: TrendsProps) {
  /**
   * CTR: Catéter
   */
  const [CTR1, setCTR1] = useState<ObjectOnlyNumbers[]>(
    new Array(39).fill(null)
  )
  const [CTR2, setCTR2] = useState<ObjectOnlyNumbers[]>(
    new Array(39).fill(null)
  )

  useEffect(() => {
    if (!versions) return
    const versionsSorted = (
      JSON.parse(JSON.stringify(versions)) as StretcherData[]
    ).sort((a, b) => a.__v - b.__v)

    const content = versionsSorted.map((stretcher) => {
      const { cateter } = stretcher
      const patient = stretcher.patientId as PatientData
      return {
        'Gasto cardiaco (TD)': cateter.gasto ?? NaN,
        'Indice cardiaco (TD)': util.calcCardiacIndexTD(
          cateter.gasto ?? NaN,
          patient.weight,
          patient.height
        ),
        'Poder cardiaco': util.calcCardiacPower(
          cateter.gasto ?? NaN,
          cateter.PAP.sistolica ?? NaN,
          cateter.PAP.diastolica ?? NaN
        ),
        'Índice de poder cardiaco': util.calcIndexedCardiacPower(
          cateter.gasto ?? NaN,
          cateter.PAP.sistolica ?? NaN,
          cateter.PAP.diastolica ?? NaN,
          patient.weight,
          patient.height
        ),
        PAPi: util.calcPAPi(
          cateter.PAP.sistolica ?? NaN,
          cateter.PAP.diastolica ?? NaN,
          cateter.presion.AD ?? NaN
        ),
      }
    })

    setCTR1((prev) => {
      const newArr = [...prev]
      newArr.unshift(
        ...content.map((stretcher) => {
          const copy = { ...stretcher } as any
          delete copy['Poder cardiaco']
          delete copy['Índice de poder cardiaco']
          delete copy['PAPi']
          return copy
        })
      )
      return newArr
    })

    setCTR2((prev) => {
      const newArr = [...prev]
      newArr.unshift(
        ...content.map((stretcher) => {
          const copy = { ...stretcher } as any
          delete copy['Gasto cardiaco (TD)']
          delete copy['Indice cardiaco (TD)']
          return copy
        })
      )
      return newArr
    })
  }, [versions])

  return (
    <Flex wrap="wrap" justify="center">
      <Graphs.Line
        data={CTR1}
        currentTab={currentTab}
        title="GASTO E INDICE CARDIACO POR TERMODILUCIÓN"
        margin={(props) => ({ ...props, right: -25, left: 5 })}
      >
        <Line dataKey="Gasto cardiaco (TD)" stroke="#8884d8" />
        <Line dataKey="Indice cardiaco (TD)" stroke="#82ca9d" />
      </Graphs.Line>

      <Graphs.Line
        data={CTR2}
        currentTab={currentTab}
        yAxisKey={['PAPi', 'right']}
        title="VARIABLES CALCULADAS (PC, PC(i), PAPi)"
        yAxis={<YAxis yAxisId="right" orientation="right" stroke="#ffc658" />}
      >
        <Line dataKey="Poder cardiaco" stroke="#8884d8" />
        <Line dataKey="Índice de poder cardiaco" stroke="#82ca9d" />
        <Line dataKey="PAPi" yAxisId="right" stroke="#ffc658" />
      </Graphs.Line>
    </Flex>
  )
}
