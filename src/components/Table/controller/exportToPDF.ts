import autoTable, { RowInput, Styles } from 'jspdf-autotable'
import getNestedValue from '../../../utils/nestValues'
import * as utils from '../../../utils/formulas'
import { ColumnType } from 'antd/es/table'
import jsPDF from 'jspdf'

type SchemaTypes = 'lab' | 'stretcher'

type ExportHeaders = {
  HEADERS: (string | { content: string; colSpan: number })[]
  KEYS: (string | undefined | string[])[]
  CHILDS: (string | null)[]
}

function schemaToHeaders(
  schema: TableSchema<unknown>[],
  body: DefaultTableSourceType,
  schemaType: SchemaTypes
): ExportHeaders | null {
  try {
    const HEADERS: ExportHeaders['HEADERS'] = []
    const CHILDS: ExportHeaders['CHILDS'] = []
    const KEYS: ExportHeaders['KEYS'] = []
    schema.forEach((column) => {
      if (typeof column.title !== 'string') {
        throw new Error('Title should be string')
      }

      if (column.children) {
        let length = column.children.length

        if (schemaType === 'stretcher') {
          if (column.title.includes('CAMA')) {
            /**
             * PARA QUITA LA COLUMNA PACIENTE Y DIAGNOSTICOS
             */
            length -= 2
            if (column.children) {
              const diagIndex = column.children.findIndex(
                (child) => child.title === 'DIAGNOSTICOS'
              )
              if (diagIndex !== -1) {
                const diag = JSON.parse(
                  JSON.stringify(column.children[diagIndex])
                )
                column.children.splice(diagIndex, 1)
                column.children.push(diag)
              }
            }
          }
        } else {
          if (column.title.includes('INFECCIOSO')) {
            length -= 1
          }
        }

        HEADERS.push({
          content: column.title,
          colSpan: length,
        })
        column.children.forEach((c: unknown) => {
          const child = c as ColumnType<unknown>

          if (typeof child.title !== 'string') {
            throw new Error('Child title should be string')
          }

          if (schemaType === 'lab') {
            if (child.title === 'Cultivos') {
              HEADERS.push({ content: child.title, colSpan: 3 })
              CHILDS.push(...['cultivo 1', 'cultivo 2', 'cultivo 3'])
              const res = getNestedValue(
                body,
                'infective.cultivos'
              ) as unknown as Cultivo[]
              const toPush = new Array(3).fill(['infective', 'cultivos'])
              for (const i in toPush) {
                if (Number(i) >= res.length) {
                  toPush[i] = undefined
                }
              }
              KEYS.push(...toPush)
              return
            }
          } else {
            if (child.title === 'PACIENTE') {
              HEADERS.push({ content: child.title, colSpan: 2 })
              CHILDS.push(...['Nombre Completo', 'DNI'])
              KEYS.push(...['patientId.fullname', 'patientId.dni'])
              return
            } else if (schemaType === 'stretcher') {
              if (child.title === 'DIAGNOSTICOS') {
                HEADERS.push({ content: child.title, colSpan: 2 })
                CHILDS.push(...['Diagnóstico 1', 'Diagnóstico 2'])
                KEYS.push(...['diagnostic.type', 'diagnostic.subType'])
                return
              }
            }
          }

          KEYS.push(child.dataIndex as string[])
          CHILDS.push(child.title)
        })
      } else {
        if (schemaType === 'stretcher') {
          if (column.title === 'Drogas') {
            HEADERS.push({ content: column.title, colSpan: 4 })
            CHILDS.push(...['Droga 1', 'Droga 2', 'Droga 3', 'Droga 4'])
            KEYS.push(...new Array(4).fill(['suministros', 'drogas']))
            return
          }
        }

        HEADERS.push(column.title)
        KEYS.push(column.dataIndex)
        CHILDS.push(null)
      }
    })
    return { HEADERS, CHILDS, KEYS }
  } catch (error) {
    console.error('Error en schemaToHeaders: ', error)
    return null
  }
}

function bodyGenerator(
  body: DefaultTableSourceType,
  ExportHeaders: ExportHeaders,
  stretchers: StretcherData[],
  schemaType: SchemaTypes
) {
  const { HEADERS, KEYS } = ExportHeaders

  let bodyList: DefaultTableSourceType[] | undefined

  if (body.children) {
    bodyList = body.children
    delete body.children
    bodyList.unshift(body)
    bodyList.sort((a, b) => b.__v - a.__v)
  } else {
    bodyList = [body]
  }

  const BODY: RowInput[] = []
  for (const arrItem of bodyList) {
    let counter = 0

    const arr: RowInput = []

    type ShoudlSkipType = {
      path: string | undefined
      index?: number
      item?: string
    }
    const shoudlSkip = ({ path, index, item }: ShoudlSkipType) => {
      let shouldSkip = false
      const handlerBody = {
        arr,
        path,
        index,
        arrItem,
        counter,
        stretchers,
        exported: ExportHeaders,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any
      if (typeof item === 'string') {
        handlerBody.item = item
      }
      if (schemaType == 'lab') {
        shouldSkip = handlerLabReport(handlerBody)
      } else if (schemaType == 'stretcher') {
        shouldSkip = handlerStretcherReport(handlerBody)
      }
      return shouldSkip
    }

    for (const item of HEADERS) {
      if (typeof item !== 'string') {
        for (let i = 0; i < item.colSpan; i++) {
          let path: string | undefined
          if (Array.isArray(KEYS[counter + i]))
            path = (KEYS[counter + i] as unknown as string[]).join('.')
          else path = KEYS[counter + i]?.toString()

          if (shoudlSkip({ path, index: i })) continue

          if (path === undefined) {
            arr.push('N/A')
            continue
          }

          const res = getNestedValue(
            arrItem as unknown as Record<string, unknown>,
            path
          )

          arr.push(res)
        }
        counter += item.colSpan
      } else {
        let path = KEYS[counter]

        if (Array.isArray(path)) {
          path = path.join('.')
        }

        if (shoudlSkip({ path, item })) {
          counter += 1
          continue
        }

        if (path === undefined) {
          counter += 1
          arr.push('N/A')
          continue
        }

        const res = getNestedValue(
          arrItem as unknown as Record<string, unknown>,
          path
        )

        arr.push(res)
        counter += 1
      }
    }
    BODY.push(arr)
  }
  return BODY
}

export default function exportToPDF(
  body: DefaultTableSourceType,
  schema: TableSchema<unknown>[],
  stretchers: StretcherData[],
  schemaType: SchemaTypes
) {
  try {
    const bodyCopy = JSON.parse(JSON.stringify(body))
    const schemaCopy = JSON.parse(JSON.stringify(schema))

    const headers = schemaToHeaders(schemaCopy, bodyCopy, schemaType)

    if (!headers) return false

    const { HEADERS, CHILDS } = headers

    validateContent(headers)

    const BODY = bodyGenerator(bodyCopy, headers, stretchers, schemaType)

    // return

    validateContent(headers, BODY)

    const columnStyles: { [key: string]: Partial<Styles> } = {}
    const styles: Partial<Styles> = { halign: 'center', lineWidth: 0.3 }

    if (schemaType == 'lab') {
      columnStyles['34'] = { cellPadding: 1, fontSize: 3 }
      columnStyles['35'] = { cellPadding: 1, fontSize: 3 }
      columnStyles['36'] = { cellPadding: 1, fontSize: 3 }
      styles.fontSize = 4
    } else if (schemaType == 'stretcher') {
      styles.fontSize = 6
    }

    const doc = new jsPDF({
      orientation: 'landscape',
      compress: true,
      format: 'a3',
    })

    autoTable(doc, {
      styles,
      columnStyles,
      head: [HEADERS, CHILDS],
      body: BODY,
      tableWidth: 'auto',
      margin: 2,
    })
    const patientName = bodyCopy.patientId.fullname as string
    doc.save(`Reporte_${schemaType}_${patientName.replace(' ', '_')}.pdf`)
    return true
  } catch (error) {
    console.error('Error en exportToPDF: ', error)
    return false
  }
}

function validateContent(exported: ExportHeaders, body?: RowInput[]) {
  const { CHILDS, HEADERS, KEYS } = exported
  const MAX_LENGTH = HEADERS.reduce((a, b) => {
    if (typeof b === 'string') {
      return (a += 1)
    } else {
      return (a += b.colSpan)
    }
  }, 0)

  const CHILDS_LENGTH = CHILDS.length
  const KEYS_LENGTH = KEYS.length

  const onFail = (arr: unknown[], arrName: string) => {
    throw new Error(
      `[contentValidator] Validation failed
    La distancia de uno de los array discrepa con la distancia máxima permitida:
    - MAX_LENGHT: ${MAX_LENGTH}
    - ${arrName.toUpperCase()}: ${arr.length}`
    )
  }

  if (MAX_LENGTH !== CHILDS_LENGTH) {
    onFail(CHILDS, 'childs')
  } else if (MAX_LENGTH !== KEYS_LENGTH) {
    onFail(KEYS as [], 'keys')
  }
  if (body) {
    for (let i = 0; i < body.length; i++) {
      if (MAX_LENGTH !== body[i].length) onFail(body[i] as [], 'BODY')
    }
  }
}

interface handlerReportType {
  path: string | undefined
  arrItem: DefaultTableSourceType
  arr: unknown[]
  counter: number
  index?: number
  stretchers: StretcherData[] | undefined
  exported: ExportHeaders
  item?: string
}

function handlerLabReport(props: handlerReportType) {
  const { CHILDS } = props.exported
  const { path, arrItem, arr, counter, index, stretchers } = props

  if (path === undefined) {
    if (index === undefined) {
      throw new Error('index cannot be undefined')
    }

    if (CHILDS[counter + index]?.includes('indirecta')) {
      const total = getNestedValue(
        arrItem as unknown as Record<string, unknown>,
        'liver_profile.bilirrubina.total'
      ) as unknown as number
      const directa = getNestedValue(
        arrItem as unknown as Record<string, unknown>,
        'liver_profile.bilirrubina.directa'
      ) as unknown as number

      if (!total || !directa) {
        arr.push('N/A')
        return true
      }

      arr.push((total - directa).toFixed(2))
      return true
    } else if (CHILDS[counter + index]?.includes('T.F.G (C-G)')) {
      const gender = getNestedValue(
        arrItem as unknown as Record<string, unknown>,
        'patientId.gender'
      ) as unknown as 'M' | 'F'
      const creatinina = getNestedValue(
        arrItem as unknown as Record<string, unknown>,
        'kidney.creatinina'
      ) as unknown as number | null
      const age = getNestedValue(
        arrItem as unknown as Record<string, unknown>,
        'patientId.age'
      ) as unknown as number
      const weight = getNestedValue(
        arrItem as unknown as Record<string, unknown>,
        'patientId.weight'
      ) as unknown as number

      if (!creatinina || !age || !weight) {
        arr.push('N/A')
        return true
      }

      arr.push(utils.calcTFG(gender, creatinina, age, weight))
      return true
    } else {
      arr.push('N/A')
      return true
    }
  }

  const find = () => {
    if (index === undefined) {
      throw new Error('index cannot be undefined')
    }

    const res = getNestedValue(
      arrItem as unknown as Record<string, unknown>,
      path
    ) as unknown

    let num: string | number | undefined =
      CHILDS[counter + index]?.split(' ')[1]

    if (!num) {
      throw new Error('CHILDS no coincide con cultivos')
    }

    num = Number(num)

    return { res, index: num }
  }

  if (path.includes('stretcherId')) {
    arr.push(
      stretchers?.find(
        (stretcher) => stretcher._id === arrItem.patientId.stretcherId
      )?.label || 'N/A'
    )
    return true
  } else if (path.includes('editedAt')) {
    arr.push(new Date(arrItem.editedAt).toLocaleDateString())
    return true
  } else if (path.includes('diagnostic')) {
    if (path.includes('FEVI')) {
      const res = getNestedValue(
        arrItem as unknown as Record<string, unknown>,
        path
      )

      if (!res) {
        arr.push('-')
        return true
      }

      let fevi: string | null = null

      switch (res) {
        case '50': {
          fevi = '>50%'
          break
        }
        case '40-': {
          fevi = '40-'
          break
        }
        case '40': {
          fevi = '<40%'
          break
        }
        default: {
          fevi = 'N/A'
          break
        }
      }

      arr.push(fevi)
      return true
    }

    const { index: num, res } = find() as { index: number; res: string }

    let diagnostic: string = 'N/A'

    if (num === 1) {
      switch (res) {
        case 'shock': {
          diagnostic = 'Shock Cardiogénico'
          break
        }
        case 'falla_cardiaca': {
          diagnostic = 'Falla Cardiaca'
          break
        }
        case 'valvular': {
          diagnostic = 'Valvulopatía'
          break
        }
        case 'infarto': {
          diagnostic = 'Infarto de miocardio'
          break
        }
        default: {
          diagnostic = 'N/A'
          break
        }
      }
    } else if (num === 2) {
      switch (res) {
        case 'isquemico': {
          diagnostic = 'Isquémico'
          break
        }
        case 'no_isquemico': {
          diagnostic = 'No Isquémico'
          break
        }
        case 'cronica': {
          diagnostic = 'Crónica'
          break
        }
        case 'FCAD': {
          diagnostic = 'F.C.A.D.'
          break
        }
        case 'aguda': {
          diagnostic = 'Aguda'
          break
        }
        case 'st_no_elevado': {
          diagnostic = 'ST no Elevado'
          break
        }
        case 'st_elevado': {
          diagnostic = 'ST Elevado'
          break
        }
        case 'aortico': {
          diagnostic = 'Aórtico'
          break
        }
        case 'mitral': {
          diagnostic = 'Mitral'
          break
        }
        case 'tricuspide': {
          diagnostic = 'Tricúspide'
          break
        }
        default: {
          diagnostic = 'N/A'
          break
        }
      }
    } else {
      switch (res) {
        case 'isquemia': {
          diagnostic = 'Isquemica'
          break
        }
        case 'no_isquemica': {
          diagnostic = 'No Isquemica'
          break
        }
        case 'anterior': {
          diagnostic = 'Anterior'
          break
        }
        case 'anterosepta': {
          diagnostic = 'Anterosepta'
          break
        }
        case 'inferior': {
          diagnostic = 'Inferior'
          break
        }
        case 'inf_post_la': {
          diagnostic = 'INF/POST/LA'
          break
        }
        case 'insuficiente': {
          diagnostic = 'Insuficiente'
          break
        }
        case 'estenosis': {
          diagnostic = 'Estenosis'
          break
        }
        case 'doble_lesion': {
          diagnostic = 'Doble Lesión'
          break
        }
        default: {
          diagnostic = 'N/A'
          break
        }
      }
    }

    arr.push(diagnostic)
    return true
  } else if (path.includes('cultivos')) {
    const { index, res } = find() as { index: number; res: Cultivo[] }

    if (res.length < index) {
      arr.push('N/A')
      return true
    }

    const cultivo = res[index - 1].cultivo.toUpperCase()
    const germen = res[index - 1].germen
    const resultado = res[index - 1].resultado ? 'POSITIVO' : 'NEGATIVOS'

    arr.push(`${cultivo}\n${resultado}\n${germen ? germen : '-'}`)
    return true
  }

  return false
}

function handlerStretcherReport(props: handlerReportType) {
  const { CHILDS } = props.exported
  const { path, arrItem, arr, counter, index } = props
  const stretcher = arrItem as unknown as StretcherData
  const patient = stretcher.patientId as PatientData

  if (path === undefined) {
    const cateter = stretcher.cateter
    if (index === undefined) {
      if (props.item === 'Gradiente TP') {
        const res = utils.calcTPGradient(
          cateter.PAP.sistolica ?? 0,
          cateter.PAP.diastolica ?? 0,
          cateter.presion.capilar ?? 0,
          'up'
        )
        arr.push(res)
        return true
      } else if (props.item?.includes('DYNAS')) {
        const res = utils.calcSysEndurance(
          cateter.presion.mediaSistemica ?? 0,
          cateter.presion.AD ?? 0,
          cateter.gasto ?? 0,
          'up'
        )
        arr.push(isNaN(res) ? 'N/A' : res)
        return true
      } else if (props.item?.includes('pulmonar')) {
        const res = utils.calcPulmonaryResistance(
          cateter.PAP.sistolica ?? 0,
          cateter.PAP.diastolica ?? 0,
          cateter.presion.capilar ?? 0,
          cateter.gasto ?? 0,
          'down'
        )
        arr.push(isNaN(res) ? 'N/A' : res)
        return true
      } else if (props.item?.includes('Cardíaco (TD)')) {
        const res = utils.calcCardiacIndexTD(
          cateter.gasto ?? 0,
          patient.weight,
          patient.height
        )
        arr.push(res)
        return true
      } else if (props.item?.includes('(iPC)')) {
        const res = utils.calcIndexedCardiacPower(
          cateter.gasto ?? 0,
          cateter.PAP.sistolica ?? 0,
          cateter.PAP.diastolica ?? 0,
          patient.weight,
          patient.height
        )
        arr.push(res)
        return true
      } else if (props.item?.includes('Poder Cardíaco')) {
        const res = utils.calcCardiacPower(
          cateter.gasto ?? 0,
          cateter.PAP.sistolica ?? 0,
          cateter.PAP.diastolica ?? 0
        )
        arr.push(res)
        return true
      } else if (props.item?.includes('PAPi')) {
        const res = utils.calcPAPi(
          cateter.PAP.sistolica ?? 0,
          cateter.PAP.diastolica ?? 0,
          cateter.presion.AD ?? 0
        )
        arr.push(isNaN(res) ? 'N/A' : res)
        return true
      } else if (props.item?.includes('PVC')) {
        const res = (
          Number(cateter.presion.AD) / Number(cateter.presion.capilar)
        ).toFixed(2)
        arr.push(isNaN(Number(res)) ? 'N/A' : res)
        return true
      } else if (props.item?.includes('iTSVD')) {
        const res = utils.calcITSVD(
          cateter.PAP.sistolica ?? 0,
          cateter.PAP.diastolica ?? 0,
          cateter.presion.AD ?? 0,
          cateter.gasto ?? 0,
          patient.weight,
          patient.height,
          stretcher.patientHeartRate ?? 0
        )
        arr.push(isNaN(res) ? 'N/A' : res)
        return true
      } else if (props.item?.includes('iTSVI')) {
        const res = utils.calcITSVI(
          cateter.PAP.sistolica ?? 0,
          cateter.PAP.diastolica ?? 0,
          cateter.presion.capilar ?? 0,
          cateter.gasto ?? 0,
          patient.weight,
          patient.height,
          stretcher.patientHeartRate ?? 0
        )
        arr.push(isNaN(res) ? 'N/A' : res)
        return true
      } else if (props.item?.includes('Asistencia')) {
        arr.push(stretcher.aid ? stretcher.aid[0] : 'N/A')
        return true
      }

      return false
    }

    if (CHILDS[counter + index]?.includes('Media')) {
      const res = utils.calcAvgPAP(
        cateter.PAP.sistolica ?? 0,
        cateter.PAP.diastolica ?? 0
      )
      arr.push(res)
      return true
    }
    return false
  }

  if (path.includes('editedAt')) {
    if (index === undefined) {
      throw new Error('index cannot be undefined')
    }

    if (CHILDS[counter + index]?.includes('Fecha')) {
      arr.push(new Date(arrItem.editedAt).toLocaleDateString())
      return true
    } else if (CHILDS[counter + index]?.includes('Hora')) {
      arr.push(new Date(arrItem.editedAt).toLocaleTimeString())
      return true
    }
  } else if (path.includes('diagnostic')) {
    if (path.includes('type')) {
      let type = 'N/A'
      const val = getNestedValue(
        arrItem as unknown as Record<string, unknown>,
        path
      ) as unknown as StretcherData['diagnostic']['type']

      switch (val) {
        case 'shock_isq': {
          type = 'Shock Cardiogénico Isquemico'
          break
        }
        case 'shock': {
          type = 'Shock Cardiogénico No Isquemico'
          break
        }
        case 'falla_avanzada': {
          type = 'Falla Avanzada'
          break
        }
      }

      arr.push(type)
      return true
    } else {
      /**
       * AQUI SUBTYPE ES '-' PORQUE SOLO ES APLICABLE
       * SI TYPE ES FALLA AVANZADA
       */
      let subtype = '-'
      const val = getNestedValue(
        arrItem as unknown as Record<string, unknown>,
        path
      ) as unknown as StretcherData['diagnostic']['subtype']

      switch (val) {
        case 'intermacs_1': {
          subtype = 'INTERMACS 1'
          break
        }
        case 'intermacs_2': {
          subtype = 'INTERMACS 2'
          break
        }
        case 'intermacs_3': {
          subtype = 'INTERMACS 3'
          break
        }
      }

      arr.push(subtype)
      return true
    }
  } else if (path.includes('drogas')) {
    if (index === undefined) {
      throw new Error('index cannot be undefined')
    }

    const res = getNestedValue(
      arrItem as unknown as Record<string, unknown>,
      path
    ) as unknown as (SuppliedDrugs[])

    if (res.length < index + 1) {
      arr.push('N/A')
      return true
    }

    arr.push(`${res[index].name} (${res[index].dose})`)
    return true
  }

  return false
}
