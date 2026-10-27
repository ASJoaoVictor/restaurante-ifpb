import { Turma, TurmasGetAllOrderBy } from '@/api/endpoints/api.schemas'
import { getTurmasGetAllQueryKey, useTurmasGetAll, useTurmasRemove } from '@/api/endpoints/turmas'
import { columnsTurmas } from '@/components/columns/turmas.columns'
import { DataProviderTable } from '@/components/data-table/table'
import { Wrapper } from '@/components/layout/wrapper'
import { checkRole } from '@/utils/auth-helpers'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/turmas/')({
  component: RouteComponent,
  head: () => ({ meta: [{ title: 'Gerenciar turmas | IFPB Meals' }] }),
  beforeLoad: ({ context }) => {
    checkRole(context, ['admin'])
  }
})

function RouteComponent() {
  return (
    <Wrapper title="Gerenciar turmas">
      <DataProviderTable<Turma>
        id="turmas"
        addPage="/admin/turmas/adicionar"
        getQueryKey={getTurmasGetAllQueryKey}
        listHook={useTurmasGetAll}
        removeHook={useTurmasRemove}
        columns={columnsTurmas}
        defaultSorting={{
          id: 'curso_nome' satisfies TurmasGetAllOrderBy,
          desc: false
        }}
      />
    </Wrapper>
  )
}
