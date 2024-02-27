import { DataEditableType } from ".."

export function suppliedToTableValuesType(supplied?: Supplied | undefined): DataEditableType[] {
  if (!supplied || !supplied.drogas) return []
  return supplied.drogas.map((drug) => ({
    key: drug.name,
    name: drug.name,
    dose: drug.dose,
  }))
}

export function tableValuesAsSupplied(tableValues: DataEditableType[]): Supplied["drogas"] | Promise<never> {
  const shouldSend = !tableValues.find((item) => item.name === 'SELECCIONAR')
  if (shouldSend) {
    const suministros = tableValues.map((item: Partial<DataEditableType>) => { delete item.key; return item }) as Supplied["drogas"]
    return suministros
  }
  return Promise.reject('Por favor compruebe los campos en suministros.')
}
