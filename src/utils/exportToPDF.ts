import autoTable, { RowInput, Styles } from 'jspdf-autotable'
import jsPDF from 'jspdf'

interface ExportToPDFProps {
  headers: RowInput
  childs: RowInput
  body: RowInput[]
  fileName: string
  options?: {
    columnStyles?: { [key: string]: Partial<Styles> }
    styles: Partial<Styles>
  }
}

export default function exportToPDF(props: ExportToPDFProps) {
  try {
    const { headers, childs, body, fileName, options } = props
    const doc = new jsPDF({
      orientation: 'landscape',
      compress: true,
      format: 'a3',
    })

    autoTable(doc, {
      styles: options?.styles,
      columnStyles: options?.columnStyles,
      head: [headers, childs],
      body: body,
      tableWidth: 'auto',
      margin: 2,
    })

    doc.save(`${fileName.replace('.pdf', '')}.pdf`)
    return true
  } catch (error) {
    console.error('Error en exportToPDF: ', error)
    return false
  }
}
