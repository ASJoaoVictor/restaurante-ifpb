import { ChamadaComTotalInscritosDto, ChamadasGetAllOrderBy } from '@/api/endpoints/api.schemas'
import { getChamadasGetAllQueryKey, useChamadasGetAll, useChamadasRemove } from '@/api/endpoints/chamadas'
import { columnsChamadas } from '@/components/columns/chamadas.columns'
import { DataProviderTable } from '@/components/data-table/table'
import { Wrapper } from '@/components/layout/wrapper'
import { useAuth } from '@/contexts/auth'
import { checkRole } from '@/utils/auth-helpers'
import { createFileRoute, useNavigate } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/chamadas/')({
  component: RouteComponent,
  head: () => ({ meta: [{ title: 'Gerenciar chamadas | IFPB Meals' }] }),
  beforeLoad: ({ context }) => {
    checkRole(context, ['admin', 'gestor', 'colaborador'])
  }
})

function RouteComponent() {
  const navigate = useNavigate()
  const { me } = useAuth()
  const podeGerenciarChamadas = Boolean(me.user?.isGestor || me.user?.isAdmin)

  return (
    <Wrapper title="Gerenciar chamadas">
      <DataProviderTable<ChamadaComTotalInscritosDto>
        id="chamadas"
        addPage={podeGerenciarChamadas ? '/admin/chamadas/adicionar' : undefined}
        getQueryKey={getChamadasGetAllQueryKey}
        listHook={useChamadasGetAll}
        removeHook={useChamadasRemove as any}
        columns={columnsChamadas(podeGerenciarChamadas)}
        defaultSorting={{
          id: 'status' satisfies ChamadasGetAllOrderBy,
          desc: true
        }}
        onRowClick={async (row) => {
          await navigate({
            to: podeGerenciarChamadas ? '/admin/chamadas/$id/inscricoes' : '/admin/chamadas/$id/presenca',
            params: { id: row.original.id }
          })
        }}
      />
    </Wrapper>
  )
}
