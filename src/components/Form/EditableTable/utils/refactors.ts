export function suppliedToTableValuesType(
  supplied?: SuppliedDrugs[] | undefined
): DataSourceType[] {
  if (!supplied) return []
  return supplied.map((drug) => ({
    key: drug.name,
    name: drug.name,
    dose: drug.dose,
  }))
}

export function tableValuesAsSupplied(
  tableValues: DataSourceType[]
): SuppliedDrugs[] | Promise<never> {
  return tableValues.map((item: Partial<DataSourceType>) => {
    delete item.key
    return item
  }) as SuppliedDrugs[]
}

export function validateTableSuppliedValues(
  tableValues: DataSourceType[]
): boolean {
  return !tableValues.some((item) => item.name === 'SELECCIONAR')
}

export function cultivoFormToCultivo(cultivo: CultivoFormType[]) {
  return cultivo.map((item) => {
    return {
      cultivo: item.cultivo.toLocaleLowerCase() as Cultivo['cultivo'],
      resultado: item.resultado === 'POSITIVO' ? true : false,
      germen: item.germen,
    } as Cultivo
  })
}

export function cultivoToCultivoForm(cultivo: Cultivo[]) {
  return cultivo.map((item, index) => {
    return {
      key: index,
      cultivo: item.cultivo.charAt(0).toUpperCase() + item.cultivo.substring(1) as CultivoFormType['cultivo'],
      resultado: String(item.resultado) === 'true' ? 'POSITIVO' : 'NEGATIVO',
      germen: item.germen,
    } as CultivoFormType
  })
}
