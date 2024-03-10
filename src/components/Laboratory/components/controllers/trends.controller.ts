import { calcTFG } from '../../../Form/utils/formulas'

interface ControllerProps {
  versions: LaboratoryData[]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setter: React.Dispatch<React.SetStateAction<any>>
}

export const initializeHB2 = ({ versions, setter }: ControllerProps) => {
  const data = versions.map((version) => {
    return { plaquetas: version.hematology.plaquetas! }
  })
  setter(data)
}

export const initializeKP = ({
  versions,
  setter,
  kidney,
}: ControllerProps & { kidney: Kidney[] }) => {
  const patient = versions[0].patientId as PatientData
  const refactoredKidney = kidney.map((k) => {
    return {
      ...k,
      TFG: calcTFG(patient.gender, k.creatinina!, patient.age, patient.weight),
    }
  })
  setter(refactoredKidney)
}

export const initializeLP2 = ({ versions, setter }: ControllerProps) => {
  const data = versions.map((version) => {
    const total = Number(version.liver_profile.bilirrubina.total)
    const directa = Number(version.liver_profile.bilirrubina.directa)
    const indirecta =
      isNaN(total) || isNaN(directa) ? '?' : (total - directa).toFixed(2)
    return {
      ...version.liver_profile.bilirrubina,
      indirecta,
    }
  })
  setter(data)
}
