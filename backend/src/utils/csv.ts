import { stringify } from 'csv-stringify/sync'

const CSV_FORMULA_PREFIX = /^\s*[=+\-@]/

export type CsvCell = string | number | boolean | null | undefined

function sanitizeCsvCell(value: CsvCell): CsvCell {
  let text = value === null || value === undefined ? '' : String(value)

  if (CSV_FORMULA_PREFIX.test(text)) text = `'${text}`

  return text
}

export function createCsv(headers: readonly string[], rows: CsvCell[][]): Buffer {
  const records = [headers, ...rows].map((row) => row.map(sanitizeCsvCell))
  const content = stringify(records, {
    bom: true,
    delimiter: ';',
    quoted: true,
    record_delimiter: '\r\n',
  })

  return Buffer.from(content, 'utf8')
}
