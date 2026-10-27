import { Aluno } from '@/api/endpoints/api.schemas'
import { OrvalPaginatedGetQueryKey, OrvalPaginatedQuery } from '@/types/api'
import { createColumnHelper } from '@tanstack/react-table'
import { DefaultHeader } from '../data-table/headers/default-header'
import { AlunoFaltasDisplay } from '../displays/aluno-faltas.display'
import { UsuarioEmailDisplay } from '../displays/usuario-email.display'
import { UsuarioNomeDisplay } from '../displays/usuario-nome.display'
import { UsuarioTelefoneDisplay } from '../displays/usuario-telefone.display'
import { Clipboard } from '../resources/alunos/clipboard'

export const columnHelper = createColumnHelper<Aluno>()

export const columnsAlunosSelecionar =
  (isGestor: boolean) => (listHook: OrvalPaginatedQuery<Aluno>, getQueryKey: OrvalPaginatedGetQueryKey) => [
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
      cell: (i) => <AlunoFaltasDisplay aluno={i.row.original} somenteVisualizacao={!isGestor} />,
      enableSorting: false,
      enableHiding: false
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

    columnHelper.accessor('turma.turma', {
      header: (info) => <DefaultHeader<Aluno> info={info} name="Turma" />,
      cell: (i) => i.getValue(),
      size: 0
    }),

    columnHelper.accessor('curso.nomeCurto', {
      header: (info) => <DefaultHeader<Aluno> info={info} name="Curso" />,
      cell: (i) => i.getValue(),
      size: 0
    })
  ]
