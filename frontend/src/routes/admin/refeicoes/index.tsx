import { Refeicao, RefeicoesGetAllOrderBy } from '@/api/endpoints/api.schemas'
import { getRefeicoesGetAllQueryKey, useRefeicoesGetAll, useRefeicoesRemove } from '@/api/endpoints/refeicoes'
import { columnsRefeicoes } from '@/components/columns/refeicoes.columns'
import { DataProviderTable } from '@/components/data-table/table'
import { Wrapper } from '@/components/layout/wrapper'
import { checkRole } from '@/utils/auth-helpers'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/refeicoes/')({
  component: RouteComponent,
  head: () => ({ meta: [{ title: 'Gerenciar refeições | IFPB Meals' }] }),
  beforeLoad: ({ context }) => {
    checkRole(context, ['admin', 'gestor'])
  }
})

function RouteComponent() {
  return (
    <Wrapper title="Gerenciar refeições">
      <DataProviderTable<Refeicao>
        id="refeicoes"
        addPage="/admin/refeicoes/adicionar"
        getQueryKey={getRefeicoesGetAllQueryKey}
        listHook={useRefeicoesGetAll}
        removeHook={useRefeicoesRemove}
        columns={columnsRefeicoes}
        defaultSorting={{
          id: 'nome' satisfies RefeicoesGetAllOrderBy,
          desc: false
        }}
      />
    </Wrapper>
  )
}
