export const shouldUpdateConsumption = (
  prevValues: IStretcherFormType,
  curValues: IStretcherFormType
) => {
  const weight = curValues.patientId?.weight
  const height = curValues.patientId?.height
  const heartRate = curValues.patientHeartRate
  const age = curValues.patientId?.age
  return (
    weight !== prevValues.patientId?.weight ||
    height !== prevValues.patientId?.height ||
    heartRate !== prevValues.patientHeartRate ||
    age !== prevValues.patientId?.age
  )
}

export const shouldUpdateHbCapacity = (
  prevValues: IStretcherFormType,
  curValues: IStretcherFormType
) => {
  const hemoglobin = curValues.fick?.hemoglobina
  return hemoglobin !== prevValues.fick?.hemoglobina
}

export const shouldUpdateDiff = (
  prevValues: IStretcherFormType,
  curValues: IStretcherFormType
) => {
  const hemoglobin = curValues.fick?.hemoglobina
  const arteria = curValues.muestra?.arteria.sat
  const vena = curValues.muestra?.vena.sat
  return (
    arteria !== prevValues.muestra?.arteria.sat ||
    vena !== prevValues.muestra?.vena.sat ||
    hemoglobin !== prevValues.fick?.hemoglobina
  )
}

export const shouldUpdateAP = (
  prevValues: IStretcherFormType,
  curValues: IStretcherFormType
) => {
  const hemoglobin = curValues.fick?.hemoglobina
  const vena = curValues.muestra?.vena.sat
  return (
    hemoglobin !== prevValues.fick?.hemoglobina ||
    vena !== prevValues.muestra?.vena.sat
  )
}

export const shouldUpdateAo = (
  prevValues: IStretcherFormType,
  curValues: IStretcherFormType
) => {
  const hemoglobin = curValues.fick?.hemoglobina
  const arteria = curValues.muestra?.arteria.sat
  return (
    arteria !== prevValues.muestra?.arteria.sat ||
    hemoglobin !== prevValues.fick?.hemoglobina
  )
}

export const shouldUpdateSpent = (
  prevValues: IStretcherFormType,
  curValues: IStretcherFormType
) => {
  const weight = curValues.patientId?.weight
  const height = curValues.patientId?.height
  const heartRate = curValues.patientHeartRate
  const age = curValues.patientId?.age
  const hemoglobin = curValues.fick?.hemoglobina
  const saturationAo = curValues.muestra?.arteria.sat
  const saturationAp = curValues.muestra?.vena.sat
  return (
    weight !== prevValues.patientId?.weight ||
    height !== prevValues.patientId?.height ||
    heartRate !== prevValues.patientHeartRate ||
    age !== prevValues.patientId?.age ||
    hemoglobin !== prevValues.fick?.hemoglobina ||
    saturationAo !== prevValues.muestra?.arteria.sat ||
    saturationAp !== prevValues.muestra?.vena.sat
  )
}

export const shouldUpdateIndex = (
  prevValues: IStretcherFormType,
  curValues: IStretcherFormType
) => {
  const weight = curValues.patientId?.weight
  const height = curValues.patientId?.height
  const heartRate = curValues.patientHeartRate
  const age = curValues.patientId?.age
  const hemoglobin = curValues.fick?.hemoglobina
  const saturationAo = curValues.muestra?.arteria.sat
  const saturationAp = curValues.muestra?.vena.sat
  return (
    weight !== prevValues.patientId?.weight ||
    height !== prevValues.patientId?.height ||
    heartRate !== prevValues.patientHeartRate ||
    age !== prevValues.patientId?.age ||
    hemoglobin !== prevValues.fick?.hemoglobina ||
    saturationAo !== prevValues.muestra?.arteria.sat ||
    saturationAp !== prevValues.muestra?.vena.sat
  )
}
