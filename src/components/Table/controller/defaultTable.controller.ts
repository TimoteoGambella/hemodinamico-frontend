import { suppliedSchema } from '../../Form/constants/suppliedSchemaDrugs'
import AxiosController from '../../../utils/axios.controller'
import createWorkbook from '../../../utils/exportToExcel'
import getNestedValue from '../../../utils/nestValues'
import exportToPDF from '../../../utils/exportToPDF'
import { RowInput, Styles } from 'jspdf-autotable'
import * as utils from '../../../utils/formulas'
import { ColumnType } from 'antd/es/table'

/**
 * ESTA VAINA SE PUEDE OPTIMIZAR X1000 PERO NO TENGO TIEMPO
 */

type SchemaTypes = 'lab' | 'stretcher'

interface SchemaToHeadersProps {
  schema: TableSchema<unknown>[]
  body: DefaultTableSourceType
  schemaType: SchemaTypes
}

/* ========================== REQUESTS ========================== */

export async function getAllStretchers() {
  const res = await new AxiosController().getStretchers(true, true)
  if (res instanceof Error) {
    return null
  } else {
    return res.data.data as StretcherData[]
  }
}

/* ========================== SCHEMA PDF EXPORTER ========================== */
type PdfExportHeaders = {
  HEADERS: (string | { content: string; colSpan: number })[]
  KEYS: (string | undefined | string[])[]
  CHILDS: (string | null)[]
}

interface SchemaToPdfProps {
  body: DefaultTableSourceType
  schema: TableSchema<unknown>[]
  /**
   * @param stretchers - Debe contener todas las camas, incluso las eliminadas
   */
  stretchers: StretcherData[]
  schemaType: SchemaTypes
}

export function schemaToPDF(props: SchemaToPdfProps) {
  const { body, schema, stretchers, schemaType } = props
  try {
    const bodyCopy = JSON.parse(JSON.stringify(body))
    const schemaCopy = JSON.parse(JSON.stringify(schema))

    const headers = schemaToHeaders({
      schema: schemaCopy,
      body: bodyCopy,
      schemaType,
    })

    if (!headers) return false

    const { HEADERS, CHILDS } = headers

    validateContent(headers)

    const BODY = bodyGenerator({
      body: bodyCopy,
      ExportHeaders: headers,
      stretchers,
      schemaType,
    })

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

    const patientName = bodyCopy.patientId.fullname as string

    return exportToPDF({
      body: BODY,
      childs: CHILDS,
      headers: HEADERS,
      fileName: `Reporte_${schemaType}_${patientName.replace(' ', '_')}.pdf`,
      options: { columnStyles, styles },
    })
  } catch (error) {
    console.error('Error en exportToPDF: ', error)
    return false
  }
}

function schemaToHeaders(props: SchemaToHeadersProps) {
  const { schema, body, schemaType } = props
  try {
    const HEADERS: PdfExportHeaders['HEADERS'] = []
    const CHILDS: PdfExportHeaders['CHILDS'] = []
    const KEYS: PdfExportHeaders['KEYS'] = []
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
    return { HEADERS, CHILDS, KEYS } as PdfExportHeaders
  } catch (error) {
    console.error('Error en schemaToHeaders: ', error)
    return null
  }
}

interface BodyGeneratorProps {
  body: DefaultTableSourceType
  ExportHeaders: PdfExportHeaders
  stretchers: StretcherData[]
  schemaType: SchemaTypes
}

function bodyGenerator(props: BodyGeneratorProps) {
  const { body, ExportHeaders, stretchers, schemaType } = props
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
          ) as string[]

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
        ) as string[]

        arr.push(res)
        counter += 1
      }
    }
    BODY.push(arr)
  }
  return BODY
}

function validateContent(exported: PdfExportHeaders, body?: RowInput[]) {
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
  exported: PdfExportHeaders
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
      ) as string

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
    const resultado = res[index - 1].resultado ? 'POSITIVO' : 'NEGATIVO'

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
    ) as unknown as SuppliedDrugs[]

    if (res.length < index + 1) {
      arr.push('N/A')
      return true
    }

    arr.push(`${res[index].name} (${res[index].dose})`)
    return true
  }

  return false
}

/* ========================== SCHEMA EXCEL EXPORTER ========================== */

type ExcelExportHeaders = {
  KEYS: (string | string[] | undefined)[]
  HEADERS: string[]
}

export async function schemaToExcel(props: SchemaToPdfProps) {
  const { body, schema, schemaType, stretchers } = props
  try {
    const bodyCopy = JSON.parse(JSON.stringify(body))
    const schemaCopy = JSON.parse(JSON.stringify(schema))

    const headers = schemaToExcelHeaders({
      schema: schemaCopy,
      body: bodyCopy,
      schemaType,
    })

    if (!headers) return false

    const { HEADERS } = headers

    validateSchemExcel(headers)

    const BODY = bodyExcelGenerator({
      body: bodyCopy,
      ExportHeaders: headers,
      stretchers,
      schemaType,
    })

    const sheetName = schemaType === 'lab' ? 'BD Laboratorio' : 'BD Camas'

    return await createWorkbook(HEADERS, BODY, sheetName, 'BD General')
  } catch (error) {
    console.error('Error en schemaToExcel: ', error)
    return false
  }
}

function validateSchemExcel(props: ExcelExportHeaders) {
  const { HEADERS, KEYS } = props
  const MAX_LENGTH = HEADERS.length
  const KEYS_LENGTH = KEYS.length

  const onFail = (arr: unknown[], arrName: string) => {
    throw new Error(
      `[contentValidator] Validation failed
    La distancia de uno de los array discrepa con la distancia máxima permitida:
    - MAX_LENGHT: ${MAX_LENGTH}
    - ${arrName.toUpperCase()}: ${arr.length}`
    )
  }

  if (MAX_LENGTH !== KEYS_LENGTH) {
    onFail(KEYS, 'keys')
  }
}

function schemaToExcelHeaders(props: SchemaToHeadersProps) {
  const { schema, schemaType } = props
  try {
    const HEADERS: ExcelExportHeaders['HEADERS'] = []
    const KEYS: ExcelExportHeaders['KEYS'] = []
    schema.forEach((column) => {
      if (typeof column.title !== 'string') {
        throw new Error('Title should be string')
      }

      if (column.children) {
        column.children.forEach((c: unknown) => {
          const child = c as ColumnType<unknown>

          if (typeof child.title !== 'string') {
            throw new Error('Child title should be string')
          }

          if (schemaType === 'lab') {
            if (child.title === 'Cultivos') {
              for (let i = 0; i < 3; i++) {
                HEADERS.push(child.title.replace('s', ' ') + (i + 1))
                HEADERS.push(
                  'Resultado del ' + child.title.replace('s', ' ') + (i + 1)
                )
                HEADERS.push(
                  'Germen del ' + child.title.replace('s', ' ') + (i + 1)
                )
              }
              KEYS.push(...new Array(9).fill(['infective', 'cultivos']))
              return
            } else if (child.title.includes('Fecha')) {
              HEADERS.push(...['Fecha', 'Hora'])
              KEYS.push(...new Array(2).fill([child.dataIndex]))
              return
            }
          } else {
            if (child.title === 'PACIENTE') {
              const arr = ['Nombre Completo', 'DNI']
              for (let i = 0; i < 2; i++) {
                HEADERS.push(arr[i])
              }
              KEYS.push(...['patientId.fullname', 'patientId.dni'])
              return
            } else if (schemaType === 'stretcher') {
              if (child.title === 'DIAGNOSTICOS') {
                for (let i = 0; i < 2; i++) {
                  HEADERS.push(child.title.slice(0, 11) + ' ' + (i + 1))
                }
                KEYS.push(...['diagnostic.type', 'diagnostic.subType'])
                return
              }
            }
          }

          HEADERS.push(child.title)
          KEYS.push(child.dataIndex as string[])
        })
      } else {
        if (schemaType === 'stretcher') {
          if (column.title === 'Drogas') {
            for (let index = 0; index < 4; index++) {
              HEADERS.push(column.title.replace('s', ' ') + (index + 1))
              HEADERS.push(
                'Dosis ' + column.title.replace('s', ' ') + (index + 1)
              )
              HEADERS.push(
                'Unidad ' + column.title.replace('s', ' ') + (index + 1)
              )
            }
            KEYS.push(...new Array(12).fill(['suministros', 'drogas']))
            return
          }
        }

        HEADERS.push(column.title)
        KEYS.push(column.dataIndex)
      }
    })
    return { HEADERS, KEYS } as ExcelExportHeaders
  } catch (error) {
    console.error('Error en schemaToHeaders: ', error)
    return null
  }
}

interface WithChildren<T> {
  children?: T[]
}

type TypeVersionsWithChildren<T> = T & WithChildren<T>

interface BodyExcelGeneratorProps {
  body: TypeVersionsWithChildren<StretcherVersions | LabVersions>[]
  ExportHeaders: ExcelExportHeaders
  stretchers: StretcherData[]
  schemaType: SchemaTypes
}

function bodyExcelGenerator(props: BodyExcelGeneratorProps) {
  const { ExportHeaders, stretchers, schemaType } = props
  const { HEADERS, KEYS } = ExportHeaders

  props.body.sort((a, b) => b.createdAt - a.createdAt)
  const body: (LabVersions | StretcherVersions)[] = []

  for (const arrItem of props.body) {
    if (!arrItem.children) {
      body.push(arrItem)
      continue
    }

    arrItem.children?.sort((a, b) => b.createdAt - a.createdAt)

    const index = body.length

    body.push(...arrItem.children)
    delete arrItem.children
    body.splice(index, 0, arrItem)
  }

  const BODY = []
  for (const currentItem of body) {
    let counter = 0

    const container: string[] = []

    type ShoudlSkipType = {
      path: string | undefined
      item: string
    }
    const shoudlSkip = ({ path, item }: ShoudlSkipType) => {
      let shouldSkip = false
      const handlerBody = {
        container,
        path,
        currentItem,
        counter,
        stretchers,
        exported: ExportHeaders,
        item,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any
      if (schemaType == 'lab') {
        shouldSkip = handlerLabExport(handlerBody)
      } else if (schemaType == 'stretcher') {
        shouldSkip = handlerStretcherExport(handlerBody)
      }
      return shouldSkip
    }

    for (const item of HEADERS) {
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
        container.push('N/A')
        continue
      }

      const res = getNestedValue(
        currentItem as unknown as Record<string, unknown>,
        path
      ) as string

      container.push(res ? res : 'N/A')
      counter += 1
    }
    BODY.push(container)
  }
  return BODY
}

interface HandlerExportProps {
  container: unknown[]
  path: string | undefined
  currentItem: StretcherVersions | LabVersions
  counter: number
  stretchers: StretcherData[]
  exported: ExcelExportHeaders
  item: string
}

function handlerStretcherExport(props: HandlerExportProps) {
  const { path, currentItem, container, item } = props

  if (path === undefined) {
    const cateter = (currentItem as StretcherVersions).cateter
    const patient = (currentItem as StretcherVersions).patientId

    if (props.item === 'Gradiente TP') {
      const res = utils.calcTPGradient(
        cateter.PAP.sistolica ?? 0,
        cateter.PAP.diastolica ?? 0,
        cateter.presion.capilar ?? 0,
        'up'
      )
      container.push(res)
      return true
    } else if (props.item?.includes('DYNAS')) {
      const res = utils.calcSysEndurance(
        cateter.presion.mediaSistemica ?? 0,
        cateter.presion.AD ?? 0,
        cateter.gasto ?? 0,
        'up'
      )
      container.push(isNaN(res) ? 'N/A' : res)
      return true
    } else if (props.item?.includes('pulmonar')) {
      const res = utils.calcPulmonaryResistance(
        cateter.PAP.sistolica ?? 0,
        cateter.PAP.diastolica ?? 0,
        cateter.presion.capilar ?? 0,
        cateter.gasto ?? 0,
        'down'
      )
      container.push(isNaN(res) ? 'N/A' : res)
      return true
    } else if (props.item?.includes('Cardíaco (TD)')) {
      const res = utils.calcCardiacIndexTD(
        cateter.gasto ?? 0,
        patient.weight,
        patient.height
      )
      container.push(res)
      return true
    } else if (props.item?.includes('(iPC)')) {
      const res = utils.calcIndexedCardiacPower(
        cateter.gasto ?? 0,
        cateter.PAP.sistolica ?? 0,
        cateter.PAP.diastolica ?? 0,
        patient.weight,
        patient.height
      )
      container.push(res)
      return true
    } else if (props.item?.includes('Poder Cardíaco')) {
      const res = utils.calcCardiacPower(
        cateter.gasto ?? 0,
        cateter.PAP.sistolica ?? 0,
        cateter.PAP.diastolica ?? 0
      )
      container.push(res)
      return true
    } else if (props.item?.includes('PAPi')) {
      const res = utils.calcPAPi(
        cateter.PAP.sistolica ?? 0,
        cateter.PAP.diastolica ?? 0,
        cateter.presion.AD ?? 0
      )
      container.push(isNaN(res) ? 'N/A' : res)
      return true
    } else if (props.item?.includes('PVC')) {
      const res = (
        Number(cateter.presion.AD) / Number(cateter.presion.capilar)
      ).toFixed(2)
      container.push(isNaN(Number(res)) ? 'N/A' : Number(res))
      return true
    } else if (props.item?.includes('iTSVD')) {
      const res = utils.calcITSVD(
        cateter.PAP.sistolica ?? 0,
        cateter.PAP.diastolica ?? 0,
        cateter.presion.AD ?? 0,
        cateter.gasto ?? 0,
        patient.weight,
        patient.height,
        (currentItem as StretcherVersions).patientHeartRate ?? 0
      )
      container.push(isNaN(res) ? 'N/A' : res)
      return true
    } else if (props.item?.includes('iTSVI')) {
      const res = utils.calcITSVI(
        cateter.PAP.sistolica ?? 0,
        cateter.PAP.diastolica ?? 0,
        cateter.presion.capilar ?? 0,
        cateter.gasto ?? 0,
        patient.weight,
        patient.height,
        (currentItem as StretcherVersions).patientHeartRate ?? 0
      )
      container.push(isNaN(res) ? 'N/A' : res)
      return true
    } else if (props.item.includes('Media')) {
      const res = utils.calcAvgPAP(
        cateter.PAP.sistolica ?? 0,
        cateter.PAP.diastolica ?? 0
      )
      container.push(res)
      return true
    }

    return false
  }

  if (path.includes('diagnostic')) {
    let type = 'N/A'
    const val = getNestedValue(
      currentItem as unknown as Record<string, unknown>,
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

    container.push(type)
    return true
  } else if (path.includes('editedAt')) {
    if (!currentItem.editedAt) {
      container.push('-')
      return true
    }

    if (item.includes('Fecha')) {
      container.push(new Date(currentItem.editedAt).toLocaleDateString())
      return true
    } else if (item.includes('Hora')) {
      container.push(new Date(currentItem.editedAt).toLocaleTimeString())
      return true
    }
  } else if (path.includes('droga')) {
    const res = getNestedValue(
      currentItem as unknown as Record<string, unknown>,
      path
    ) as unknown as SuppliedDrugs[]

    const index = findIndexInItem(item)

    if (res.length <= index) {
      container.push('N/A')
      return true
    }

    if (item.includes('Dosis')) {
      container.push(res[index].dose)
      return true
    } else if (item.includes('Unidad')) {
      const drugName = res[index].name
      let unit = '-'
      for (const item of suppliedSchema) {
        const drug = item.children.find((child) => child.value === drugName)
        if (drug) {
          unit = drug.unidad
          break
        }
      }
      container.push(unit)
      return true
    }

    container.push(`${res[index].name}`)
    return true
  } else if (path.includes('aid')) {
    const res = getNestedValue(
      currentItem as unknown as Record<string, unknown>,
      path
    ) as unknown as StretcherData['aid']

    container.push(res ? res[0].toUpperCase() : 'N/A')
    return true
  }

  return false
}

function handlerLabExport(props: HandlerExportProps) {
  const { path, currentItem, container, item, stretchers } = props

  if (path === undefined) {
    if (item.includes('indirecta')) {
      const total = getNestedValue(
        currentItem as unknown as Record<string, unknown>,
        'liver_profile.bilirrubina.total'
      ) as unknown as number
      const directa = getNestedValue(
        currentItem as unknown as Record<string, unknown>,
        'liver_profile.bilirrubina.directa'
      ) as unknown as number

      if (!total || !directa) {
        container.push('N/A')
        return true
      }

      container.push((total - directa).toFixed(2))
      return true
    } else if (item.includes('T.F.G (C-G)')) {
      const gender = getNestedValue(
        currentItem as unknown as Record<string, unknown>,
        'patientId.gender'
      ) as unknown as 'M' | 'F'
      const creatinina = getNestedValue(
        currentItem as unknown as Record<string, unknown>,
        'kidney.creatinina'
      ) as unknown as number | null
      const age = getNestedValue(
        currentItem as unknown as Record<string, unknown>,
        'patientId.age'
      ) as unknown as number
      const weight = getNestedValue(
        currentItem as unknown as Record<string, unknown>,
        'patientId.weight'
      ) as unknown as number

      if (!creatinina || !age || !weight) {
        container.push('N/A')
        return true
      }

      container.push(utils.calcTFG(gender, creatinina, age, weight))
      return true
    } else {
      container.push('N/A')
      return true
    }
  }

  const find = () => {
    const res = getNestedValue(
      currentItem as unknown as Record<string, unknown>,
      path
    ) as unknown

    const num = findIndexInItem(item)

    return { res, index: num }
  }

  if (path.includes('stretcherId')) {
    const res =
      stretchers?.find(
        (stretcher) => stretcher._id === currentItem.patientId.stretcherId
      )?.label || 'N/A'
    container.push(res)
    return true
  } else if (path.includes('editedAt')) {
    if (!currentItem.editedAt) {
      container.push('-')
      return true
    }

    if (item.includes('Fecha')) {
      container.push(new Date(currentItem.editedAt).toLocaleDateString())
      return true
    } else if (item.includes('Hora')) {
      container.push(new Date(currentItem.editedAt).toLocaleTimeString())
      return true
    }
    return true
  } else if (path.includes('diagnostic')) {
    if (path.includes('FEVI')) {
      const res = getNestedValue(
        currentItem as unknown as Record<string, unknown>,
        path
      ) as string

      if (!res) {
        container.push('-')
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

      container.push(fevi)
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

    container.push(diagnostic)
    return true
  } else if (path.includes('cultivos')) {
    const { index, res } = find() as { index: number; res: Cultivo[] }

    if (res.length < index) {
      container.push('N/A')
      return true
    }

    const cultivo = res[index - 1].cultivo.toUpperCase()
    const germen = res[index - 1].germen
    const resultado = res[index - 1].resultado ? 'POSITIVO' : 'NEGATIVO'

    if (item.includes('Resultado')) {
      container.push(resultado)
      return true
    } else if (item.includes('Germen')) {
      container.push(germen ? germen : '-')
      return true
    } else {
      container.push(cultivo)
      return true
    }
  }

  return false
}

function findIndexInItem(item: string) {
  const match = item.match(/\d+(?=\D*$)/)
  if (!match) {
    throw new Error('No se encontró el index en el item')
  }

  return Number(match[0])
}
