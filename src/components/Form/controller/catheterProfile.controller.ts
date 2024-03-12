export const shouldUpdatePAP = (
  curValues: IStretcherFormType,
  prevValues: IStretcherFormType
) => {
  const diastolica = curValues.cateter?.PAP.diastolica
  const sistolica = curValues.cateter?.PAP.sistolica
  return (
    diastolica !== prevValues.cateter?.PAP.diastolica ||
    sistolica !== prevValues.cateter?.PAP.sistolica
  )
}

export const shouldUpdateTP = (
  curValues: IStretcherFormType,
  prevValues: IStretcherFormType
) => {
  const diastolica = curValues.cateter?.PAP.diastolica
  const sistolica = curValues.cateter?.PAP.sistolica
  const capilar = curValues.cateter?.presion.capilar
  return (
    diastolica !== prevValues.cateter?.PAP.diastolica ||
    sistolica !== prevValues.cateter?.PAP.sistolica ||
    capilar !== prevValues.cateter?.presion.capilar
  )
}

export const shouldUpdateSys = (
  curValues: IStretcherFormType,
  prevValues: IStretcherFormType
) => {
  const mediaSis = curValues.cateter?.presion.mediaSistemica
  const AD = curValues.cateter?.presion.AD
  const gasto = curValues.cateter?.gasto
  return (
    mediaSis !== prevValues.cateter?.presion.mediaSistemica ||
    AD !== prevValues.cateter?.presion.AD ||
    gasto !== prevValues.cateter?.gasto
  )
}

export const shouldUpdatePulmonary = (
  curValues: IStretcherFormType,
  prevValues: IStretcherFormType
) => {
  const diastolica = curValues.cateter?.PAP.diastolica
  const sistolica = curValues.cateter?.PAP.sistolica
  const capilar = curValues.cateter?.presion.capilar
  const gasto = curValues.cateter?.gasto
  return (
    diastolica !== prevValues.cateter?.PAP.diastolica ||
    sistolica !== prevValues.cateter?.PAP.sistolica ||
    capilar !== prevValues.cateter?.presion.capilar ||
    gasto !== prevValues.cateter?.gasto
  )
}

export const shouldUpdateIndex = (
  curValues: IStretcherFormType,
  prevValues: IStretcherFormType
) => {
  const gasto = curValues.cateter?.gasto
  const weight = curValues.patientId?.weight
  const height = curValues.patientId?.height
  if (!curValues.patientId) console.error('patientId is undefined')
  return (
    gasto !== prevValues.cateter?.gasto ||
    weight !== prevValues.patientId?.weight ||
    height !== prevValues.patientId?.height
  )
}
