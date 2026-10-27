import { Turma } from '@/api/endpoints/api.schemas'
import { TURNOS } from '@/enums/turnos'
import { OrvalPaginatedGetQueryKey, OrvalPaginatedQuery, OrvalRemoveQuery } from '@/types/api'
import { formatDia, formatTurma } from '@/utils/formatters'
import { Badge, HStack } from '@chakra-ui/react'
import { createColumnHelper } from '@tanstack/react-table'
import { getActionsColumn } from '../data-table/columns/actions'
import { getCreatedAtColumn, getUpdatedAtColumn } from '../data-table/columns/created-updated'
import { getSelectColumn } from '../data-table/columns/select'
import { DefaultHeader } from '../data-table/headers/default-header'

export const columnHelper = createColumnHelper<Turma>()

export const columnsTurmas = (
  listHook: OrvalPaginatedQuery<Turma>,
  removeHook: OrvalRemoveQuery<Turma>,
  getQueryKey: OrvalPaginatedGetQueryKey
) => [
  getSelectColumn(columnHelper),

  getActionsColumn(columnHelper, {
    link: '/admin/turmas/editar/$id',
    removeHook,
    getQueryKey
  }),

  columnHelper.display({
    id: 'nome',
    header: 'Nome',
    cell: ({ row }) => formatTurma(row.original, row.original.curso)
  }),

  columnHelper.accessor('periodo', {
    header: (info) => <DefaultHeader<Turma> info={info} name="Período" />,
    cell: (i) => i.getValue() + 'º',
    size: 0
  }),

  columnHelper.accessor('curso.nome', {
    header: (info) => <DefaultHeader<Turma> info={info} name="Nome do Curso" />,
    cell: (i) => i.getValue()
  }),

  columnHelper.accessor('turma', {
    header: (info) => <DefaultHeader<Turma> info={info} name="Turma" />,
    cell: (i) => i.getValue()
  }),

  columnHelper.accessor('turno', {
    header: (info) => <DefaultHeader<Turma> info={info} name="Turno" />,
    cell: (i) => TURNOS[i.getValue()!] || null,
    size: 0
  }),

  columnHelper.accessor('diasContraturno', {
    header: (info) => <DefaultHeader<Turma> info={info} name="Dias Contraturno" />,
    cell: (i) => (
      <HStack gap={1}>
        {i.getValue().map((dia) => (
          <Badge key={dia}>{formatDia(dia, true)}</Badge>
        ))}
      </HStack>
    )
  }),

  getCreatedAtColumn(columnHelper),

  getUpdatedAtColumn(columnHelper)
]
