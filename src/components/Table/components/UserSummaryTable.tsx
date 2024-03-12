import UserSummarySchema from '../constants/UserSummarySchema'
import useStretchers from '../../../hooks/useStretchers'
import { useState, useCallback, useEffect } from 'react'
import usePatients from '../../../hooks/usePatients'
import { Typography, Table } from 'antd'

export interface PatientWithStretcher extends Omit<PatientData, 'stretcherId'> {
  key: React.Key
  stretcherId: string | StretcherData | null
}

interface UsrSumProps {
  patientId: string | null
}

export default function UserSummaryTable({ patientId }: UsrSumProps) {
  const [patient, setPatient] = useState<PatientWithStretcher[] | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const stretchers = useStretchers()
  const patients = usePatients()

  const findPatient = useCallback(
    (id: string) => {
      return patients.find((p) => p._id === id) as PatientWithStretcher
    },
    [patients]
  )
  const findStretcher = useCallback(
    (id: string) => {
      return stretchers?.find((s) => s._id === id)
    },
    [stretchers]
  )

  useEffect(() => {
    if (!patientId) return
    const patient = findPatient(patientId)
    if (patient) {
      if (patient.stretcherId) {
        const stretcher = findStretcher(patient.stretcherId as string)
        if (stretcher) patient.stretcherId = stretcher
      }
      patient.key = 0
      setPatient([patient])
    }
  }, [findPatient, findStretcher, patientId])

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
        dataSource={patient as PatientWithStretcher[]}
        pagination={{ position: ['none'] }}
        bordered
      />
    </>
  )
}
