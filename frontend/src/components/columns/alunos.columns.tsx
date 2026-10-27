import { Aluno } from '@/api/endpoints/api.schemas'
import { OrvalPaginatedGetQueryKey, OrvalPaginatedQuery, OrvalRemoveQuery } from '@/types/api'
import { formatTurma } from '@/utils/formatters'
import { createColumnHelper } from '@tanstack/react-table'
import { getActionsColumn } from '../data-table/columns/actions'
import { getCreatedAtColumn, getUpdatedAtColumn } from '../data-table/columns/created-updated'
import { getSelectColumn } from '../data-table/columns/select'
import { DefaultHeader } from '../data-table/headers/default-header'
import { AlunoFaltasDisplay } from '../displays/aluno-faltas.display'
import { UsuarioEmailDisplay } from '../displays/usuario-email.display'
import { UsuarioNomeDisplay } from '../displays/usuario-nome.display'
import { UsuarioTelefoneDisplay } from '../displays/usuario-telefone.display'
import { Clipboard } from '../resources/alunos/clipboard'

export const columnHelper = createColumnHelper<Aluno>()

export const columnsAlunos =
  (isAdmin: boolean) =>
  (
    listHook: OrvalPaginatedQuery<Aluno>,
    removeHook: OrvalRemoveQuery<Aluno>,
    getQueryKey: OrvalPaginatedGetQueryKey
  ) => [
    ...(isAdmin
      ? [
          getSelectColumn(columnHelper),

          getActionsColumn(columnHelper, {
            link: '/admin/alunos/editar/$id',
            removeHook,
            getQueryKey
          })
        ]
      : []),

    columnHelper.accessor('usuario.name', {
      header: (info) => <DefaultHeader<Aluno> info={info} name="Nome" />,
      cell: (i) => <UsuarioNomeDisplay usuario={i.row.original.usuario} />,
      size: 0
    }),

    columnHelper.accessor('matricula', {
      header: (info) => <DefaultHeader<Aluno> info={info} name="Matrícula" />,
      cell: (i) => <Clipboard text={i.getValue()} />,
      size: 0
    }),

    columnHelper.accessor('faltas', {
      header: (info) => <DefaultHeader<Aluno> info={info} name="Controle de Faltas" />,
      cell: (i) => <AlunoFaltasDisplay aluno={i.row.original} />
    }),

    columnHelper.accessor('usuario.email', {
      header: (info) => <DefaultHeader<Aluno> info={info} name="E-mail" />,
      cell: (i) => <UsuarioEmailDisplay usuario={i.row.original.usuario} />,
      size: 0
    }),

    columnHelper.accessor('usuario.phone', {
      header: (info) => <DefaultHeader<Aluno> info={info} name="Telefone" />,
      cell: (i) => <UsuarioTelefoneDisplay usuario={i.row.original.usuario} />,
      size: 0
    }),

    columnHelper.display({
      id: 'turma',
      header: (info) => <DefaultHeader<Aluno> info={info} name="Turma" />,
      cell: (i) => formatTurma(i.row.original.turma!, i.row.original.curso!),
      size: 0
    }),

    columnHelper.accessor('curso.nomeCurto', {
      header: (info) => <DefaultHeader<Aluno> info={info} name="Curso" />,
      cell: (i) => i.getValue(),
      size: 0
    }),

    getCreatedAtColumn(columnHelper),

    getUpdatedAtColumn(columnHelper)
  ]
