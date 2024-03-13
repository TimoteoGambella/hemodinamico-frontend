/* eslint-disable @typescript-eslint/no-explicit-any */
type FormData = {
  touched?: boolean
  validating?: boolean
  errors?: string[]
  warnings?: string[]
  name: string[]
  validated?: boolean
  value: any
  originRCField: boolean
}

type FormObserverProps = {
  setter: (_: boolean) => void
  initalValues: Record<string, any>
}

export function removeUnusedProps(obj: object, props: string[]) {
  return Object.fromEntries(
    Object.entries(obj).filter(([key]) => !props.includes(key))
  )
}

export default class FormDirty {
  private initalValues: Record<string, any>

  constructor(initalValues: FormObserverProps['initalValues']) {
    this.initalValues = initalValues
  }

  /**
   * @summary Este método se encarga de comparar los valores actuales del formulario con los valores iniciales.
   * @param {FormObserverProps['initalValues']} values Es el objeto que contiene los valores actuales del formulario `(form.getValues)`.
   * @returns {boolean} Retorna `true` si los valores son diferentes a los valores iniciales, de lo contrario retorna `false`.
   */
  public isDirty(values: FormObserverProps['initalValues'], specificField?: string) {
    if (specificField) return !this.compareValues(this.initalValues[specificField], values[specificField])
    return !this.compareValues(this.initalValues, values)
  }

  /**
   * @description Este método esta diseñado para ser utilizado en el evento `onFieldsChange` de un formulario de antd.
   * @summary Este método se encarga de manejar el estado de `isDirty` de un formulario.
   * @param {FormObserverProps['setter']} setter - Función que se encarga de cambiar el estado en el componente padre.
   */
  public getDirtyObserver(setter: FormObserverProps['setter']) {
    const handler = (e: any) => {
      const changedValues = e as FormData[]
      const isDirty = this.handleIsDirty(changedValues)
      setter(!isDirty)
    }

    return handler
  }

  private handleIsDirty(changedValues: FormData[]) {
    // Iteramos sobre los valores cambiados para determinar si el formulario está sucio
    const isDirty = Object.keys(changedValues).some(
      (_: string, index: number) => {
        // Obtenemos el valor previo
        const inputName = changedValues[index].name
        let prevValue = this.initalValues

        // Iteramos sobre el nombre del campo para obtener el valor previo
        for (const key of inputName) {
          prevValue = prevValue[key]
        }

        // Comparamos los valores
        const curValue = changedValues[index].value
        return curValue !== prevValue
      }
    )
    return isDirty
  }

  private compareValues(value1: any, value2: any): boolean {
    // Si los valores son diferentes tipos, consideramos que están sucios
    if (typeof value1 !== typeof value2) {
      return true
    }

    // Si los valores son objetos, comparamos sus propiedades
    if (this.isObject(value1) && this.isObject(value2)) {
      const keys1 = Object.keys(value1)
      const keys2 = Object.keys(value2)

      // Si el número de claves es diferente, consideramos que están sucios
      if (keys1.length !== keys2.length) {
        return false
      }

      // Comparamos recursivamente las propiedades
      for (const key of keys1) {
        if (!this.compareValues(value1[key], value2[key])) {
          return false
        }
      }

      return true
    }

    // Si los valores son iguales, no están sucios
    return value1 === value2
  }

  private isObject(value: any) {
    return value !== null && typeof value === 'object' && !Array.isArray(value)
  }
}
