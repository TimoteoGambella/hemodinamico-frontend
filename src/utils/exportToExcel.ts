import { CellValue, Workbook } from 'exceljs'
import FileSaver from 'file-saver'

export default async function createWorkbook(
  header: CellValue[],
  body: CellValue[][],
  sheetName: string,
  fileName: string
) {
  try {
    if (body.some((row) => header.length !== row.length)) {
      throw new Error('Mismatch between header and body length')
    }

    const workbook = new Workbook()
    const worksheet = workbook.addWorksheet(sheetName)

    // Agregar encabezados
    const headerRow = worksheet.getRow(1)
    headerRow.font = { bold: true }
    headerRow.height = 20
    header.forEach((header, index) => {
      headerRow.getCell(index + 1).value = header
      headerRow.getCell(index + 1).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'CC449FFF' }, // Azul
        bgColor: { argb: 'CC449FFF' }, // Azul
      }
      headerRow.getCell(index + 1).font = {
        color: { argb: 'FF000000' }, // Negro
        bold: true,
      }
      headerRow.getCell(index + 1).border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      }
    })

    // Agregar datos
    body.forEach((row, index) => {
      const dataRow = worksheet.getRow(index + 2)
      row.forEach((cell, cellIndex) => {
        dataRow.getCell(cellIndex + 1).value = cell
      })
    })

    // Aplicar formato a las celdas
    worksheet.eachRow((row, rowNum) => {
      if (rowNum === 1) {
        return
      }
      row.eachCell((cell) => {
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        }
        cell.alignment = { vertical: 'middle', horizontal: 'center' }
      })
    })

    // Obtener el ancho máximo de cada columna
    const maxColumnLengths: number[] = []
    worksheet.eachRow((row) => {
      row.eachCell((cell, colNum) => {
        const cellLength = cell.text.length
        maxColumnLengths[colNum - 1] =
          Math.max(maxColumnLengths[colNum - 1] || 0, cellLength) + 0.5
      })
    })

    // Ajustar el ancho de las columnas
    maxColumnLengths.forEach((maxLength, index) => {
      worksheet.getColumn(index + 1).width = maxLength
    })

    // Guardar archivo
    const buffer = await workbook.xlsx.writeBuffer()
    const fileType =
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    FileSaver.saveAs(new Blob([buffer], { type: fileType }), fileName)
    return true
  } catch (error) {
    console.error('Error creating workbook:', error)
    return false
  }
}
