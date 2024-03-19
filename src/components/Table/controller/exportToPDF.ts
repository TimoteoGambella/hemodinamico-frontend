import autoTable, { RowInput, Styles } from 'jspdf-autotable'
import getNestedValue from '../../../utils/nestValues'
import { calcTFG } from '../../../utils/formulas'
import { ColumnType } from 'antd/es/table'
import jsPDF from 'jspdf'

type SchemaTypes = 'lab' | 'stretcher'

type ExportHeaders = {
  HEADERS: (string | { content: string; colSpan: number })[]
  CHILDS: (string | null)[]
  KEYS: string[] | string
}

function schemaToHeaders(
  schema: TableSchema<unknown>[],
  body: DefaultTableSourceType,
  schemaType: SchemaTypes
): ExportHeaders {
  const HEADERS: ExportHeaders['HEADERS'] = []
  const CHILDS: ExportHeaders['CHILDS'] = []
  const KEYS: ExportHeaders['KEYS'] = []
  schema.forEach((column) => {
    if (column.children) {
      const length = column.title?.toString().includes('INFECCIOSO')
        ? column.children.length - 1
        : column.children.length
      HEADERS.push({
        content: column.title as string,
        colSpan: length,
      })
      column.children.forEach((c: unknown) => {
        const child = c as ColumnType<unknown>
        if (schemaType === 'lab' && child.title === 'Cultivos') {
          HEADERS.push({ content: child.title as string, colSpan: 3 })
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
        KEYS.push(child.dataIndex as string)
        CHILDS.push(child.title as string)
      })
    } else {
      HEADERS.push(column.title as string)
      KEYS.push(column.dataIndex as string)
      CHILDS.push(null)
    }
  })
  return { HEADERS, CHILDS, KEYS }
}

function bodyRefactor(
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

    for (const item of HEADERS) {
      if (typeof item !== 'string') {
        for (let i = 0; i < item.colSpan; i++) {
          let path: string | undefined
          if (Array.isArray(KEYS[counter + i]))
            path = (KEYS[counter + i] as unknown as string[]).join('.')
          else path = KEYS[counter + i]?.toString()

          let shouldSkip = false
          if (schemaType == 'lab') {
            shouldSkip = handlerLabReport({
              path,
              arrItem,
              arr,
              counter,
              i,
              stretchers,
              exported: ExportHeaders,
            })
          } else if (schemaType == 'stretcher') {
            throw new Error('Caso no manejado.')
          }

          if (shouldSkip) continue

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
        throw new Error('Caso no manejado.')
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
  const bodyCopy = JSON.parse(JSON.stringify(body))
  const headers = schemaToHeaders(schema, bodyCopy, schemaType)
  const { HEADERS, CHILDS } = headers

  if (!validateContent(headers)) return

  const BODY = bodyRefactor(bodyCopy, headers, stretchers, schemaType)

  if (!validateContent(headers, BODY)) return

  const columnStyles: { [key: string]: Partial<Styles> } = {}

  if (schemaType == 'lab') {
    columnStyles['34'] = { cellPadding: 1, fontSize: 3 }
    columnStyles['35'] = { cellPadding: 1, fontSize: 3 }
    columnStyles['36'] = { cellPadding: 1, fontSize: 3 }
  }

  const doc = new jsPDF({
    orientation: 'landscape',
    compress: true,
    format: 'a3',
  })

  autoTable(doc, {
    styles: { halign: 'center', lineWidth: 0.3, fontSize: 4 },
    columnStyles,
    head: [HEADERS, CHILDS],
    body: BODY,
    tableWidth: 'auto',
    margin: 2,
  })
  const patientName = bodyCopy.patientId.fullname as string
  doc.save(`Reporte_${schemaType}_${patientName.replace(' ', '_')}.pdf`)
}

function validateContent(exported: ExportHeaders, body?: RowInput[]) {
  const { CHILDS, HEADERS, KEYS } = exported
  const MAX_LENGHT = HEADERS.reduce((a, b) => {
    if (typeof b === 'string') {
      return (a += 1)
    } else {
      return (a += b.colSpan)
    }
  }, 0)

  const CHILDS_LENGHT = CHILDS.length
  const KEYS_LENGHT = KEYS.length

  const onFail = (arr: unknown[], arrName: string) => {
    console.error(
      `[contentValidator] Validation failed
    La distancia de uno de los array discrepa con la distancia máxima permitida:
    - MAX_LENGHT: ${MAX_LENGHT}
    - ${arrName.toUpperCase()}: ${arr.length}`
    )
    return false
  }

  if (MAX_LENGHT !== CHILDS_LENGHT) {
    return onFail(CHILDS, 'childs')
  } else if (MAX_LENGHT !== KEYS_LENGHT) {
    return onFail(KEYS as [], 'keys')
  }
  if (body) {
    for (let i = 0; i < body.length; i++) {
      if (MAX_LENGHT !== body[i].length) return onFail(body[i] as [], 'BODY')
    }
  }

  return true
}

interface handlerLabReportType {
  path: string
  arrItem: DefaultTableSourceType
  arr: unknown[]
  counter: number
  i: number
  stretchers: StretcherData[] | undefined
  exported: ExportHeaders
}

function handlerLabReport(props: handlerLabReportType) {
  const { CHILDS } = props.exported
  const { path, arrItem, arr, counter, i, stretchers } = props

  if (path === undefined) {
    if (CHILDS[counter + i]?.includes('indirecta')) {
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
        return false
      }

      arr.push((total - directa).toFixed(2))
      return false
    } else if (CHILDS[counter + i]?.includes('T.F.G (C-G)')) {
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
        return false
      }

      arr.push(calcTFG(gender, creatinina, age, weight))
      return false
    } else {
      arr.push('N/A')
      return false
    }
  }

  const find = () => {
    const res = getNestedValue(
      arrItem as unknown as Record<string, unknown>,
      path
    ) as unknown

    let index: string | number | undefined =
      CHILDS[counter + i]?.split(' ')[1]

    if (!index) {
      throw new Error('CHILDS no coincide con cultivos')
    }

    index = Number(index)

    return { res, index }
  }

  if (path.includes('stretcherId')) {
    arr.push(
      stretchers?.find(
        (stretcher) => stretcher._id === arrItem.patientId.stretcherId
      )?.label || 'N/A'
    )
    return false
  } else if (path.includes('editedAt')) {
    arr.push(new Date(arrItem.editedAt).toLocaleDateString())
    return false
  } else if (path.includes('diagnostic')) {
    if (path.includes('FEVI')) {
      const res = getNestedValue(
        arrItem as unknown as Record<string, unknown>,
        path
      )

      if (!res) {
        arr.push('-')
        return false
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
      return false
    }

    const { index, res } = find() as { index: number; res: string }

    let diagnostic: string = 'N/A'

    if (index === 1) {
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
    } else if (index === 2) {
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
    return false
  } else if (path.includes('cultivos')) {
    const { index, res } = find() as { index: number; res: Cultivo[] }

    if (res.length < index) {
      arr.push('N/A')
      return false
    }

    const cultivo = res[index - 1].cultivo.toUpperCase()
    const germen = res[index - 1].germen
    const resultado = res[index - 1].resultado
      ? 'POSITIVO'
      : 'NEGATIVOS'

    arr.push(`${cultivo}\n${resultado}\n${germen ? germen : '-'}`)
    return false
  }

  return true
}
