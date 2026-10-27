import { sql, SQL } from 'drizzle-orm'
import { boolean, pgTable, text, timestamp, unique, uuid } from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm/relations'
import { alunos } from './aluno.schema'
import { chamadas } from './chamada.schema'
import { commonSchema } from './common'
import { comprovanteContraturnoStatusEnum, inscricaoStatusEnum, presencaStatusEnum } from '../enums'

export const inscricoes = pgTable(
  'inscricoes',
  {
    ...commonSchema,
    chamadaId: uuid('chamada_id')
      .notNull()
      .references(() => chamadas.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
    alunoId: uuid('aluno_id')
      .notNull()
      .references(() => alunos.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
    dataHoraInscricao: timestamp('data_hora_inscricao', { withTimezone: true }).notNull(),
    dataHoraCancelamento: timestamp('data_hora_cancelamento', { withTimezone: true, mode: 'string' }),
    status: inscricaoStatusEnum('status').notNull().default('pendente'),
    suap: boolean('suap').notNull().default(false),
    temAulaContraturno: boolean('tem_aula_contraturno').notNull().default(false),
    documentoComprobatorio: text('documento_comprobatorio'),
    comprovanteContraturnoStatus: comprovanteContraturnoStatusEnum('comprovante_contraturno_status')
      .notNull()
      .default('pendente'),
    justificativaRejeicaoComprovanteContraturno: text('justificativa_rejeicao_comprovante_contraturno'),
    inseridoPeloGestor: boolean('inserido_gestor').notNull().default(false),
    inseridoPeloColaborador: boolean('inserido_colaborador').notNull().default(false),
    presenca: presencaStatusEnum('presenca').notNull().default('pendente'),
    emListaEspera: boolean('em_lista_espera').notNull().default(false),
    valida: boolean('valida')
      .notNull()
      .generatedAlwaysAs(
        (): SQL => sql`
          ${inscricoes.status} = 'aceita'::${inscricaoStatusEnum}
          AND ${inscricoes.dataHoraCancelamento} IS NULL
          AND ${inscricoes.emListaEspera} = false
        `
      )
  },
  (table) => [unique('unique_aluno_chamada').on(table.alunoId, table.chamadaId)]
)

export const inscricoesRelations = relations(inscricoes, ({ one }) => ({
  aluno: one(alunos, { fields: [inscricoes.alunoId], references: [alunos.id] }),
  chamada: one(chamadas, { fields: [inscricoes.chamadaId], references: [chamadas.id] })
}))
