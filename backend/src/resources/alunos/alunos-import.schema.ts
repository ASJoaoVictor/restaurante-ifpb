import z from 'zod'

const MATRICULA_REGEX = /^\d{12}$/
const CURSO_REGEX = /^\d+\s*-\s*.*/
const CIDADE_ESTADO_REGEX = /^.+ - ([A-Z]{2})$/
const TURMA_REGEX = /^\d+\.\d+\.\d+\.([^,]+)\,.*$/

export const alunoSchema = z.object({
  Matrícula: z.coerce
    .string()
    .min(12, 'Matrícula deve ter exatamente 12 dígitos')
    .max(12, 'Matrícula deve ter exatamente 12 dígitos')
    .regex(MATRICULA_REGEX, 'Matrícula deve conter apenas números'),

  Nome: z.string('Obrigatório').min(1),

  Curso: z
    .string('Obrigatório')
    .min(1)
    .regex(CURSO_REGEX, 'Precisa ser no formato "000 - Nome do Curso"')
    .transform((val) => parseInt(val.split(' - ')[0], 10)),

  Situação: z.string('Obrigatório').min(1),

  'Situação no último período': z.string('Obrigatório').min(1),

  'Cidade do endereço': z.union([
    z.literal(''),
    z.string('Obrigatório').min(1).regex(CIDADE_ESTADO_REGEX, 'Precisa ser no formato "Cidade - UF"')
  ]).optional(),

  'E-mail acadêmico': z
    .union([z.email('E-mail inválido'), z.literal('')])
    .optional()
    .transform((val) => val || null),

  'Período atual': z.coerce.number('Precisa ser um número').min(1),

  Telefone: z.coerce
    .string()
    .optional()
    .transform((val) => val || null),

  'Turma do último período': z
    .union([
      z.literal(''),
      z
        .string()
        .regex(TURMA_REGEX, 'Formato inválido')
        .transform((val) => {
          const match = val.match(TURMA_REGEX)
          return match?.[1] || null
        })
    ])
    .optional()
    .transform((val) => val || null)
})
