import z from 'zod'

export const INSCRICAO_REGEX = /^(.+) \((\d{12})\).*$/
const DATA_REGEX = /^\d{2}\/\d{2}\/\d{4}$/

export const inscricaoSUAPSchema = z.object({
  // inscricao
  inscricao: z.string().regex(INSCRICAO_REGEX, 'Inscrição inválida'),

  // operacao
  operacao: z.enum(['Confirmacao', 'Cancelamento'], 'Operação inválida, deve ser "Confirmacao" ou "Cancelamento"'),

  // inicio_periodo
  inicio_periodo: z.string().regex(DATA_REGEX, 'Data inválida, deve ser no formato DD/MM/AAAA'),

  // fim_periodo
  fim_periodo: z.string().regex(DATA_REGEX, 'Data inválida, deve ser no formato DD/MM/AAAA')
})
