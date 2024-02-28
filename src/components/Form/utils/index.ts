export function calcASCValue(weight: number, height: number) {
  return Number(Math.sqrt((weight * height) / 3600).toFixed(2))
}

export function calcO2Consumption(weight: number, height: number, age: number, heartRate: number) {
  const ascValue = calcASCValue(weight, height)
  return Number(
    (ascValue * (138.1 - 17.04 * Math.log(age) + 0.378 * heartRate)).toFixed(2)
  )
}

export function calcHbCapacity(hemoglobin: number) {
  return Number((1.34 * hemoglobin).toFixed(2))
}

export function calcO2Content(hemoglobin: number, saturation: number) {
  return Number(((calcHbCapacity(hemoglobin) * saturation) / 100).toFixed(2))
}

export function calcCardiacOutput(weight: number, height: number, age: number, heartRate: number, hemoglobin: number, saturationAp: number, saturationAo: number) {
  const consumption = calcO2Consumption(weight, height, age, heartRate)
  const AP = calcO2Content(hemoglobin, saturationAp)
  const Ao = calcO2Content(hemoglobin, saturationAo)
  const diff = Ao - AP
  return Number((0.1 * (consumption / diff)).toFixed(2))
}

