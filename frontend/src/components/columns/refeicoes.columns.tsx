import { Refeicao } from '@/api/endpoints/api.schemas'
import { OrvalPaginatedGetQueryKey, OrvalPaginatedQuery, OrvalRemoveQuery } from '@/types/api'
import { createColumnHelper } from '@tanstack/react-table'
import { getActionsColumn } from '../data-table/columns/actions'
import { getCreatedAtColumn, getUpdatedAtColumn } from '../data-table/columns/created-updated'
import { getSelectColumn } from '../data-table/columns/select'
import { DefaultHeader } from '../data-table/headers/default-header'
import { RefeicaoHorarioEstagioDisplay } from '../displays/refeicao-horario-estagio.display'
import { ChamadaTurnoDisplay } from '../displays/chamada-turno.display'

export const columnHelper = createColumnHelper<Refeicao>()

export const columnsRefeicoes = (
  listHook: OrvalPaginatedQuery<Refeicao>,
  removeHook: OrvalRemoveQuery<Refeicao>,
  getQueryKey: OrvalPaginatedGetQueryKey
) => [
  getSelectColumn(columnHelper),

  getActionsColumn(columnHelper, {
    link: '/admin/refeicoes/editar/$id',
    removeHook,
    getQueryKey
  }),
  columnHelper.accessor('nome', {
    header: (info) => <DefaultHeader<Refeicao> info={info} name="Nome" />,
    cell: (i) => i.getValue(),
    size: 0
  }),

  columnHelper.accessor('diaDaSemana', {
    header: (info) => <DefaultHeader<Refeicao> info={info} name="Dia da Semana" />,
    cell: (i) => i.getValue(),
    size: 0
  }),

  columnHelper.accessor('vagas', {
    header: (info) => <DefaultHeader<Refeicao> info={info} name="Vagas" />,
    cell: (i) => i.getValue(),
    size: 0
  }),

  columnHelper.accessor('horarioAbertura', {
    header: (info) => <DefaultHeader<Refeicao> info={info} name="Abertura" />,
    cell: (i) => (
      <RefeicaoHorarioEstagioDisplay
        hora={i.getValue()}
        deslocamento={i.row.original.deslocamentoDataAbertura}
        automatico={i.row.original.aberturaAutomatica}
      />
    ),
    size: 0
  }),

  columnHelper.accessor('horarioFechamento', {
    header: (info) => <DefaultHeader<Refeicao> info={info} name="Fechamento" />,
    cell: (i) => (
      <RefeicaoHorarioEstagioDisplay
        hora={i.getValue()}
        deslocamento={i.row.original.deslocamentoDataFechamento}
        automatico={i.row.original.fechamentoAutomatico}
      />
    ),
    size: 0
  }),

  columnHelper.accessor('horarioDivulgacaoResultado', {
    header: (info) => <DefaultHeader<Refeicao> info={info} name="Resultado" />,
    cell: (i) => (
      <RefeicaoHorarioEstagioDisplay
        hora={i.getValue()}
        deslocamento={i.row.original.deslocamentoDataDivulgacao}
        automatico={i.row.original.divulgacaoAutomatica}
      />
    ),
    size: 0
  }),

  columnHelper.accessor('horarioFinalizacao', {
    header: (info) => <DefaultHeader<Refeicao> info={info} name="Finalização" />,
    cell: (i) => (
      <RefeicaoHorarioEstagioDisplay
        hora={i.getValue()}
        deslocamento={i.row.original.deslocamentoDataFinalizacao}
        automatico={i.row.original.finalizacaoAutomatica}
      />
    ),
    size: 0
  }),

  columnHelper.accessor('horarioEncerramento', {
    header: (info) => <DefaultHeader<Refeicao> info={info} name="Encerramento" />,
    cell: (i) => (
      <RefeicaoHorarioEstagioDisplay
        hora={i.getValue()}
        deslocamento={i.row.original.deslocamentoDataEncerramento}
        automatico={i.row.original.encerramentoAutomatico}
      />
    ),
    size: 0
  }),

  columnHelper.accessor('turno', {
    header: (info) => <DefaultHeader<Refeicao> info={info} name="Turno" />,
    cell: (i) => <ChamadaTurnoDisplay chamada={i.row.original} />,
    size: 0
  }),

  getCreatedAtColumn(columnHelper),

  getUpdatedAtColumn(columnHelper)
]
