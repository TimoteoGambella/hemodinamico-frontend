import UserSummarySchema from '../constants/UserSummarySchema'
import useStretchers from '../../../hooks/useStretchers'
import { useState, useCallback, useEffect } from 'react'
import usePatients from '../../../hooks/usePatients'
import { Typography, Table } from 'antd'

export interface PatientWithKey extends Omit<PopulatedPatient, 'stretcherId'> {
  key: React.Key
  stretcherId: string | StretcherData | null
}

interface UsrSumProps {
  patientId: string | null
}

export default function UserSummaryTable({ patientId }: UsrSumProps) {
  const [patient, setPatient] = useState<PatientWithKey[] | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const stretchers = useStretchers()
  const patients = usePatients()

  const findPatient = useCallback(
    (id: string) => {
      const finded = patients.find((p) => p._id === id)
      if (finded) return JSON.parse(JSON.stringify(finded)) as PatientWithKey 
      else return null
    },
    [patients]
  )
  const findStretcher = useCallback(
    (id: string) => {
      const finded = stretchers?.find((s) => s._id === id)
      if (finded) return JSON.parse(JSON.stringify(finded)) as StretcherData
      else return null
    },
    [stretchers]
  )

  useEffect(() => {
    if (!patientId || patient) return
    const findedPatient = findPatient(patientId)
    if (findedPatient) {
      if (findedPatient.stretcherId) {
        const stretcher = findStretcher(findedPatient.stretcherId as string)
        if (stretcher) findedPatient.stretcherId = stretcher as StretcherData
      }
      findedPatient.key = 0
      setPatient([findedPatient])
    }
  }, [findPatient, findStretcher, patientId, patient])

  useEffect(() => {
    if (patient) setIsLoading(false)
  }, [patient])
  return (
    <>
      <Typography.Title level={3}>Datos del paciente</Typography.Title>
      <Table
        className="CustomTable user-summary"
        loading={isLoading}
        columns={UserSummarySchema}
        dataSource={patient as PatientWithKey[]}
        pagination={{ position: ['none'] }}
        bordered
      />
    </>
  )
}
