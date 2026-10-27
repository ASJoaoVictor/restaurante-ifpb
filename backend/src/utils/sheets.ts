import { BadRequestException, Logger } from '@nestjs/common'
import XLSX from 'xlsx'

export function sheetToJson(buffer: Buffer, logger?: Logger) {
  try {
    // TODO: suportar csv
    const workbook = XLSX.read(buffer)
    const worksheet = workbook.Sheets[workbook.SheetNames[0]]
    const dados = XLSX.utils.sheet_to_json(worksheet)

    if (dados.length === 0) {
      throw new BadRequestException('O arquivo está vazio')
    }

    return dados
  } catch (err) {
    if (err instanceof BadRequestException) throw err
    logger?.error('Erro ao processar o arquivo Excel', err)
    throw new BadRequestException('Erro ao processar o arquivo. Verifique se é um arquivo Excel válido.')
  }
}
