import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'

export function exportAssessmentsToExcel(items, filename = 'assessments.xlsx') {
  const rows = items.map((it) => ({
    id: it.id,
    name: it.name,
    email: it.email,
    score: it.score,
    createdAt: it.createdAt instanceof Date ? it.createdAt.toISOString() : it.createdAt,
    answers: JSON.stringify(it.answers || {})
  }))

  const worksheet = XLSX.utils.json_to_sheet(rows)
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Assessments')
  const wbout = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' })
  saveAs(new Blob([wbout], { type: 'application/octet-stream' }), filename)
}
