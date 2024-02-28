import { DataSourceType } from ".."

export function suppliedToTableValuesType(supplied?: SuppliedDrugs[] | undefined): DataSourceType[] {
  if (!supplied) return []
  return supplied.map((drug) => ({
    key: drug.name,
    name: drug.name,
    dose: drug.dose,
  }))
}

export function tableValuesAsSupplied(tableValues: DataSourceType[]): SuppliedDrugs[] | Promise<never> {
  const shouldSend = !tableValues.find((item) => item.name === 'SELECCIONAR')
  if (shouldSend) {
    const suministros = tableValues.map((item: Partial<DataSourceType>) => {
      delete item.key; return item
    }) as SuppliedDrugs[]
    return suministros
  }
  return Promise.reject('Por favor compruebe los campos en suministros.')
}
