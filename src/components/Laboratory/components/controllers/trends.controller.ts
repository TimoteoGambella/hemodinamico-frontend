import { calcTFG } from '../../../../utils/formulas'

interface ControllerProps {
  versions: LaboratoryData[]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setter: React.Dispatch<React.SetStateAction<any>>
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

/**
 *
 * @param versions Lista de versiones de laboratorio
 * @returns Función que devuelve un objeto con las claves seleccionadas de cada versión
 */
export const initGetValueOf = (versions: LaboratoryData[]) => {
  /**
   *
   * @param key Debe ser una de las claves que se encuentre en `LaboratoryData`
   * @param select Debe ser un array de strings que contenga las claves que se desean seleccionar del objeto previamente seleccionado en `key`
   */
  const getValueOf = (
    key: keyof CreatedTypesOfLab,
    select: string[] = ['*']
  ) => {
    if (!versions) throw new Error('No versions initialized')
    const selectedKey = versions.map((version) => {
      return { ...(version[key] as object) }
    })
    if (select[0] !== '*') {
      const newData = selectedKey.map((data) => {
        let props = Object.keys(data as object)
        for (const i of select) {
          if (props.includes(i)) props = props.filter((prop) => prop !== i)
        }
        for (const prop of props) {
          delete data[prop as keyof typeof data]
        }
        return data as { [key: string]: number }[]
      })
      return newData as unknown as { [key: string]: number }[]
    }
    return selectedKey
  }

  return getValueOf
}

export const handleSetter = (
  prev: ObjectOnlyNumbers[],
  newVal: ObjectOnlyNumbers[]
) => {
  const newLP2 = [...prev]
  newVal.forEach((value, index) => {
    newLP2[index] = value
  })
  return newLP2
}
