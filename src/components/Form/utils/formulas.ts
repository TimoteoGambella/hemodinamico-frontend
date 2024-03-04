type RoundTypes = 'none' | 'up' | 'down'

/* ================== PATIENT ==================== */

export function calcASCValue(weight: number, height: number) {
  return Number(Math.sqrt((weight * height) / 3600).toFixed(2))
}

/* ================== FICK ==================== */

export function calcO2Consumption(
  weight: number,
  height: number,
  age: number,
  heartRate: number
) {
  const ascValue = calcASCValue(weight, height)
  const value = (
    ascValue *
    (138.1 - 17.04 * Math.log(age) + 0.378 * heartRate)
  ).toFixed(2)
  return Math.ceil(Number(value))
}

export function calcHbCapacity(hemoglobin: number, round: RoundTypes = 'none') {
  const value = Number((1.34 * hemoglobin).toFixed(2))

  if (round === 'none') return value
  if (round === 'up') return Math.ceil(value)
  else return Math.floor(value)
}

export function calcO2Content(
  hemoglobin: number,
  saturation: number,
  round: RoundTypes = 'none'
) {
  const value = Number(
    ((calcHbCapacity(hemoglobin) * saturation) / 100).toFixed(2)
  )

  if (round === 'none') return value
  if (round === 'up') return Math.ceil(value)
  else return Math.floor(value)
}

export function calcDiffSys(
  hemoglobin: number,
  veinSat: number,
  arterySat: number,
  round: RoundTypes = 'none'
) {
  const value = Number(
    (
      calcO2Content(hemoglobin, arterySat) - calcO2Content(hemoglobin, veinSat)
    ).toFixed(2)
  )

  if (round === 'none') return value
  if (round === 'up') return Math.ceil(value)
  else return Math.floor(value)
}

export function calcCardiacOutput(
  weight: number,
  height: number,
  age: number,
  heartRate: number,
  hemoglobin: number,
  saturationAp: number,
  saturationAo: number,
  round: RoundTypes = 'none'
) {
  const consumption = calcO2Consumption(weight, height, age, heartRate)
  const AP = calcO2Content(hemoglobin, saturationAp)
  const Ao = calcO2Content(hemoglobin, saturationAo)
  const diff = Ao - AP
  const value = Number((0.1 * (consumption / diff)).toFixed(2))

  if (round === 'none') return value
  if (round === 'up') return Math.ceil(value)
  else return Math.floor(value)
}

export function calcCardiacIndex(
  weight: number,
  height: number,
  age: number,
  heartRate: number,
  hemoglobin: number,
  saturationAp: number,
  saturationAo: number,
  round: RoundTypes = 'none'
) {
  const value =
    calcCardiacOutput(
      weight,
      height,
      age,
      heartRate,
      hemoglobin,
      saturationAp,
      saturationAo
    ) / calcASCValue(weight, height)
  if (round === 'none') return Number(value.toFixed(2))
  if (round === 'up') return Math.ceil(value)
  else return Math.floor(value)
}

/* ================== CATHETER ==================== */

export function calcAvgPAP(
  sistolica: number,
  diastolica: number,
  round: RoundTypes = 'none'
) {
  const value = Number(((diastolica + 2 * sistolica) / 3).toFixed(2))
  if (round === 'none') return value
  if (round === 'up') return Math.ceil(value)
  else return Math.floor(value)
}

export function calcTPGradient(
  sistolica: number,
  diastolica: number,
  presionCapilar: number,
  round: RoundTypes = 'none'
) {
  const value = Number(
    (calcAvgPAP(sistolica, diastolica) - presionCapilar).toFixed(2)
  )
  if (round === 'none') return value
  if (round === 'up') return Math.ceil(value)
  else return Math.floor(value)
}

export function calcSysEndurance(
  mediaSistemica: number,
  presionAD: number,
  gasto: number,
  round: RoundTypes = 'none'
) {
  const value = Number(
    (((mediaSistemica - presionAD) / gasto) * 79.92).toFixed(2)
  )

  if (round === 'none') return value
  if (round === 'up') return Math.ceil(value)
  else return Math.floor(value)
}

export function calcPulmonaryResistance(
  sistolica: number,
  diastolica: number,
  presionCapilar: number,
  gasto: number,
  round: RoundTypes = 'none'
) {
  const value = Number(
    ((calcAvgPAP(sistolica, diastolica) - presionCapilar) / gasto).toFixed(2)
  )

  if (round === 'none') return value
  if (round === 'up') return Math.ceil(value)
  else return Math.floor(value)
}

export function calcCardiacIndexTD(
  gasto: number,
  weight: number,
  height: number
) {
  return Number((gasto / calcASCValue(weight, height)).toFixed(2))
}

/* ================== CALCULATED VARIABLES ==================== */

export function calcCardiacPower(
  cardiacOutput: number,
  sistolica: number,
  diastolica: number
) {
  return Number(
    ((cardiacOutput * calcAvgPAP(sistolica, diastolica)) / 451).toFixed(2)
  )
}

export function calcIndexedCardiacPower(
  cardiacOutput: number,
  sistolica: number,
  diastolica: number,
  weight: number,
  height: number
) {
  return Number(
    (
      calcCardiacPower(cardiacOutput, sistolica, diastolica) /
      calcASCValue(weight, height)
    ).toFixed(2)
  )
}

export function calcPAPi(
  sistolica: number,
  diastolica: number,
  presionAD: number
) {
  return Number(((sistolica - diastolica) / presionAD).toFixed(2))
}

export function calcITSVD(
  sistolica: number,
  diastolica: number,
  presionAD: number,
  gasto: number,
  weight: number,
  height: number,
  heartRate: number
) {
  const avgPAP = calcAvgPAP(sistolica, diastolica, 'up')
  const cardiacIndex = calcCardiacIndexTD(gasto, weight, height)
  return Number(
    (((avgPAP - presionAD) * cardiacIndex * 13.6) / heartRate).toFixed(2)
  )
}

export function calcITSVI(
  sistolica: number,
  diastolica: number,
  capilar: number,
  gasto: number,
  weight: number,
  height: number,
  heartRate: number
) {
  const avgPAP = calcAvgPAP(sistolica, diastolica, 'up')
  const cardiacIndex = calcCardiacIndexTD(gasto, weight, height)
  return Number(
    (((avgPAP - capilar) * cardiacIndex * 13.6) / heartRate).toFixed(2)
  )
}

/* ================== KIDNEY PROFILE ==================== */

export function calcTFG(gender: PatientData["gender"], creatinina: number, age: number, weight: number) {
  const val = (140 - age) * weight / (72 * creatinina)
  if (gender === 'M') {
    return Number((val * 1).toFixed(2))
  } else {
    return Number((val * 0.85).toFixed(2))
  }
}
