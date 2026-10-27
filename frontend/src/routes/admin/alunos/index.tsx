import { getAlunosGetAllQueryKey, useAlunosGetAll, useAlunosRemove } from '@/api/endpoints/alunos'
import { Aluno, AlunosGetAllOrderBy } from '@/api/endpoints/api.schemas'
import { columnsAlunos } from '@/components/columns/alunos.columns'
import { DataProviderTable } from '@/components/data-table/table'
import { Wrapper } from '@/components/layout/wrapper'
import { useAuth } from '@/contexts/auth'
import { checkRole } from '@/utils/auth-helpers'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/alunos/')({
  component: RouteComponent,
  head: () => ({ meta: [{ title: 'Gerenciar alunos | IFPB Meals' }] }),
  beforeLoad: ({ context }) => {
    checkRole(context, ['admin', 'gestor'])
  }
})

function RouteComponent() {
  const { me } = useAuth()

  return (
    <Wrapper title="Gerenciar alunos">
      <DataProviderTable<Aluno>
        id="alunos"
        addPage={me.user?.isAdmin ? '/admin/alunos/adicionar' : undefined}
        getQueryKey={getAlunosGetAllQueryKey}
        listHook={useAlunosGetAll}
        removeHook={useAlunosRemove}
        columns={columnsAlunos(me.user?.isAdmin || false)}
        defaultSorting={{
          id: 'usuario_name' satisfies AlunosGetAllOrderBy,
          desc: false
        }}
      />
    </Wrapper>
  )
}
