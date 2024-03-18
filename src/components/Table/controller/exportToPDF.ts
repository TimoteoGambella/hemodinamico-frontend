import getNestedValue from '../../../utils/nestValues'
import autoTable, { RowInput } from 'jspdf-autotable'
import { ColumnType } from 'antd/es/table'
import jsPDF from 'jspdf'

const doc = new jsPDF({
  orientation: 'landscape',
  compress: true,
  format: 'a3',
})

type ExportHeaders = {
  HEADERS: (string | { content: string; colSpan: number })[]
  CHILDS: (string | null)[]
  KEYS: string[] | string
}

function schemaToHeaders(schema: TableSchema<unknown>[]): ExportHeaders {
  const HEADERS: ExportHeaders['HEADERS'] = []
  const CHILDS: ExportHeaders['CHILDS'] = []
  const KEYS: ExportHeaders['KEYS'] = []
  schema.forEach((column) => {
    if (column.children) {
      HEADERS.push({
        content: column.title as string,
        colSpan: column.children.length,
      })
      column.children.forEach((c: unknown) => {
        const child = c as ColumnType<unknown>
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
  body: LaboratoryData,
  ExportHeaders: ExportHeaders,
  stretchers: StretcherData[]
) {
  const { HEADERS, KEYS } = ExportHeaders
  const BODY: RowInput[] = []
  let counter = 0

  const arr: RowInput = []

  for (const item of HEADERS) {
    if (typeof item !== 'string') {
      for (let i = 0; i < item.colSpan; i++) {
        let path: string | undefined
        if (Array.isArray(KEYS[counter + i]))
          path = (KEYS[counter + i] as unknown as string[]).join('.')
        else path = KEYS[counter + i]?.toString()

        if (path === undefined) {
          arr.push('N/A')
          continue
        }

        if (path.includes('stretcherId')) {
          arr.push(
            stretchers?.find(
              (stretcher) => stretcher._id === body.patientId.stretcherId
            )?.label || 'N/A'
          )
          continue
        } else if (path.includes('createdAt')) {
          arr.push(new Date(body.createdAt).toLocaleDateString())
          continue
        } else if (path.includes('cultivos')) {
          arr.push('N/A')
          continue
        } else if (path.includes('indirecta')) {
          // ESTE SE LO ESTA SALTANDO PORQUE ES UNDEFINED
          arr.push('N/A')
          continue
        }

        const res = getNestedValue(
          body as unknown as Record<string, unknown>,
          path
        )

        if (path.includes('FEVI') && !res) {
          arr.push('N/A')
          continue
        }

        arr.push(res)
      }
      counter += item.colSpan
    } else {
      console.log('')
    }
  }
  BODY.push(arr)
  return BODY
}

export default function exportToPDF(
  body: LaboratoryData,
  schema: TableSchema<unknown>[],
  stretchers: StretcherData[]
) {
  const headers = schemaToHeaders(schema)
  const { HEADERS, CHILDS } = headers

  const BODY = bodyRefactor(body, headers, stretchers)

  autoTable(doc, {
    styles: { halign: 'center', lineWidth: 0.3, fontSize: 5 },
    head: [HEADERS, CHILDS],
    body: BODY,
    tableWidth: 'auto',
    margin: 2,
  })
  doc.save('table.pdf')
}
