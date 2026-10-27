import { User } from '@/api/endpoints/api.schemas'
import { ROLES } from '@/enums/roles'
import { OrvalPaginatedGetQueryKey, OrvalPaginatedQuery, OrvalRemoveQuery } from '@/types/api'
import { Badge, HStack } from '@chakra-ui/react'
import { createColumnHelper } from '@tanstack/react-table'
import { getActionsColumn } from '../data-table/columns/actions'
import { getCreatedAtColumn, getUpdatedAtColumn } from '../data-table/columns/created-updated'
import { getSelectColumn } from '../data-table/columns/select'
import { DefaultHeader } from '../data-table/headers/default-header'
import { UsuarioEmailDisplay } from '../displays/usuario-email.display'
import { UsuarioNomeDisplay } from '../displays/usuario-nome.display'
import { UsuarioTelefoneDisplay } from '../displays/usuario-telefone.display'

export const columnHelper = createColumnHelper<User>()

export const columnsUsuarios = (
  listHook: OrvalPaginatedQuery<User>,
  removeHook: OrvalRemoveQuery<User>,
  getQueryKey: OrvalPaginatedGetQueryKey
) => [
  getSelectColumn(columnHelper),

  getActionsColumn(columnHelper, {
    link: '/admin/usuarios/editar/$id',
    removeHook,
    getQueryKey
  }),

  columnHelper.accessor('name', {
    header: (info) => <DefaultHeader<User> info={info} name="Nome" />,
    cell: (i) => <UsuarioNomeDisplay usuario={i.row.original} />,
    size: 0
  }),

  columnHelper.accessor('email', {
    header: (info) => <DefaultHeader<User> info={info} name="Email" />,
    cell: (i) => <UsuarioEmailDisplay usuario={i.row.original} />
  }),

  columnHelper.accessor('phone', {
    header: (info) => <DefaultHeader<User> info={info} name="Telefone" />,
    cell: (i) => <UsuarioTelefoneDisplay usuario={i.row.original} />
  }),

  columnHelper.accessor('roles', {
    header: (info) => <DefaultHeader<User> info={info} name="Acesso" />,
    cell: (i) => (
      <HStack gap={2}>
        {i.getValue()?.map((role) => (
          <Badge key={role}>{ROLES[role]}</Badge>
        ))}
      </HStack>
    ),
    size: 0
  }),

  getCreatedAtColumn(columnHelper),

  getUpdatedAtColumn(columnHelper)
]
