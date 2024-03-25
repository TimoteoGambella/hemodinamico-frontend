/* eslint-disable @typescript-eslint/no-explicit-any */
import * as util from '../../../utils/formulas'
import { useEffect, useState } from 'react'
import { Line, YAxis } from 'recharts'
import Graphs from '../../Graph'
import { Flex } from 'antd'

interface TrendsProps {
  versions: StretcherData[] | PopulatedStretcher[] | null
  currentTab: string
}

export default function Trends({ versions, currentTab }: TrendsProps) {
  /**
   * CTR: Catéter
   * PRN: Presión
   */
  const [CTR1, setCTR1] = useState<ObjectOnlyNumbers[]>(
    new Array(39).fill(null)
  )
  const [CTR2, setCTR2] = useState<ObjectOnlyNumbers[]>(
    new Array(39).fill(null)
  )
  const [DYNAS, setDYNAS] = useState<ObjectOnlyNumbers[]>(
    new Array(39).fill(null)
  )
  const [PRN, setPRN] = useState<ObjectOnlyNumbers[]>(
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
        'Resistencia Sistémica (DYNAS)': util.calcSysEndurance(
          cateter.presion.mediaSistemica ?? NaN,
          cateter.presion.AD ?? NaN,
          cateter.gasto ?? NaN,
          'up'
        ),
        'Presión de AD': cateter.presion.AD ?? NaN,
        'Presión capilar': cateter.presion.capilar ?? NaN,
      }
    })

    let LENGTH = content.length

    if (LENGTH < 39) LENGTH = 39

    /**
     * Se debe eliminar las propiedades que no se van
     * a mostrar en su respectivo gráfico porque el
     * el grafico renderiza en 'Y' hasta el número más
     * alto de datos que se le pase.
     */

    /* ======== CTR1 ========= */

    const newCTRArr = new Array(LENGTH).fill(null)
    newCTRArr.unshift(
      ...content.map((stretcher) => {
        const copy = { ...stretcher } as any
        delete copy['Resistencia Sistémica (DYNAS)']
        delete copy['Índice de poder cardiaco']
        delete copy['Presión capilar']
        delete copy['Poder cardiaco']
        delete copy['Presión de AD']
        delete copy['PAPi']
        return copy
      })
    )

    setCTR1(newCTRArr)

    /* ======== CTR2 ========= */

    const newCTR2Arr = new Array(LENGTH).fill(null)
    newCTR2Arr.unshift(
      ...content.map((stretcher) => {
        const copy = { ...stretcher } as any
        delete copy['Resistencia Sistémica (DYNAS)']
        delete copy['Indice cardiaco (TD)']
        delete copy['Gasto cardiaco (TD)']
        delete copy['Presión capilar']
        delete copy['Presión de AD']
        return copy
      })
    )

    setCTR2(newCTR2Arr)

    /* ======== DYNAS ========= */

    const newDYNAS = new Array(LENGTH).fill(null)
    newDYNAS.unshift(
      ...content.map((stretcher) => {
        const copy = { ...stretcher } as any
        delete copy['Índice de poder cardiaco']
        delete copy['Indice cardiaco (TD)']
        delete copy['Gasto cardiaco (TD)']
        delete copy['Presión capilar']
        delete copy['Poder cardiaco']
        delete copy['Presión de AD']
        delete copy['PAPi']
        return copy
      })
    )

    setDYNAS(newDYNAS)

    /* ======== PRN ========= */

    const newPRN = new Array(LENGTH).fill(null)
    newPRN.unshift(
      ...content.map((stretcher) => {
        const copy = { ...stretcher } as any
        delete copy['Resistencia Sistémica (DYNAS)']
        delete copy['Índice de poder cardiaco']
        delete copy['Indice cardiaco (TD)']
        delete copy['Gasto cardiaco (TD)']
        delete copy['Poder cardiaco']
        return copy
      })
    )

    setPRN(newPRN)
  }, [versions])

  return (
    <Flex wrap="wrap" justify="center">
      <Graphs.Line
        data={CTR1}
        currentTab={currentTab}
        title="GASTO E INDICE CARDIACO POR TERMODILUCIÓN"
      >
        <Line dataKey="Gasto cardiaco (TD)" stroke="#8884d8" />
        <Line dataKey="Indice cardiaco (TD)" stroke="#82ca9d" />
      </Graphs.Line>

      <Graphs.Line
        data={DYNAS}
        currentTab={currentTab}
        title="RESISTENCIA SISTEMICA (DYNAS)"
      >
        <Line dataKey="Resistencia Sistémica (DYNAS)" stroke="#82ca9d" />
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

      <Graphs.Line
        data={PRN}
        currentTab={currentTab}
        title="PRESION DE AD Y PRESION CAPILAR"
      >
        <Line dataKey="Presión de AD" stroke="#8884d8" />
        <Line dataKey="Presión capilar" stroke="#82ca9d" />
      </Graphs.Line>
    </Flex>
  )
}
