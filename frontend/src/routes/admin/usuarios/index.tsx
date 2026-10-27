import { User, UsersGetAllOrderBy } from '@/api/endpoints/api.schemas'
import { getUsersGetAllQueryKey, useUsersGetAll, useUsersRemove } from '@/api/endpoints/users'
import { columnsUsuarios } from '@/components/columns/usuarios.columns'
import { DataProviderTable } from '@/components/data-table/table'
import { Wrapper } from '@/components/layout/wrapper'
import { checkRole } from '@/utils/auth-helpers'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/usuarios/')({
  component: RouteComponent,
  head: () => ({ meta: [{ title: 'Gerenciar usuários | IFPB Meals' }] }),
  beforeLoad: ({ context }) => {
    checkRole(context, ['admin'])
  }
})

function RouteComponent() {
  return (
    <Wrapper title="Gerenciar usuários">
      <DataProviderTable<User>
        id="usuarios"
        addPage="/admin/usuarios/adicionar"
        getQueryKey={getUsersGetAllQueryKey}
        listHook={useUsersGetAll}
        removeHook={useUsersRemove}
        columns={columnsUsuarios}
        defaultSorting={{
          id: 'name' satisfies UsersGetAllOrderBy,
          desc: false
        }}
      />
    </Wrapper>
  )
}
