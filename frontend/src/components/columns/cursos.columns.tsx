import { Curso } from '@/api/endpoints/api.schemas'
import { OrvalPaginatedGetQueryKey, OrvalPaginatedQuery, OrvalRemoveQuery } from '@/types/api'
import { createColumnHelper } from '@tanstack/react-table'
import { getActionsColumn } from '../data-table/columns/actions'
import { getCreatedAtColumn, getUpdatedAtColumn } from '../data-table/columns/created-updated'
import { getSelectColumn } from '../data-table/columns/select'
import { DefaultHeader } from '../data-table/headers/default-header'

export const columnHelper = createColumnHelper<Curso>()

export const columnsCursos = (
  listHook: OrvalPaginatedQuery<Curso>,
  removeHook: OrvalRemoveQuery<Curso>,
  getQueryKey: OrvalPaginatedGetQueryKey
) => [
  getSelectColumn(columnHelper),

  getActionsColumn(columnHelper, {
    link: '/admin/cursos/editar/$id',
    removeHook,
    getQueryKey
  }),

  columnHelper.accessor('nome', {
    header: (info) => <DefaultHeader<Curso> info={info} name="Nome" />,
    cell: (i) => i.getValue()
  }),

  columnHelper.accessor('nomeCurto', {
    header: (info) => <DefaultHeader<Curso> info={info} name="Nome curto" />,
    cell: (i) => i.getValue()
  }),

  columnHelper.accessor('numeroCurso', {
    header: (info) => <DefaultHeader<Curso> info={info} name="Número" />,
    cell: (i) => i.getValue(),
    size: 0
  }),

  getCreatedAtColumn(columnHelper),

  getUpdatedAtColumn(columnHelper)
]
