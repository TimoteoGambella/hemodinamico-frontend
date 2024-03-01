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
  return tableValues.map((item: Partial<DataSourceType>) => {
    delete item.key; return item
  }) as SuppliedDrugs[]
}

export function validateTableSuppliedValues(tableValues: DataSourceType[]): boolean {
  return !tableValues.some((item) => item.name === 'SELECCIONAR')
}
