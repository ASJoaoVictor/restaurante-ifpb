import { Curso, CursosGetAllOrderBy } from '@/api/endpoints/api.schemas'
import { getCursosGetAllQueryKey, useCursosGetAll, useCursosRemove } from '@/api/endpoints/cursos'
import { columnsCursos } from '@/components/columns/cursos.columns'
import { DataProviderTable } from '@/components/data-table/table'
import { Wrapper } from '@/components/layout/wrapper'
import { checkRole } from '@/utils/auth-helpers'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/cursos/')({
  component: ListaCursos,
  head: () => ({ meta: [{ title: 'Gerenciar cursos | IFPB Meals' }] }),
  beforeLoad: ({ context }) => {
    checkRole(context, ['admin'])
  }
})

export default function ListaCursos() {
  return (
    <Wrapper title="Gerenciar cursos">
      <DataProviderTable<Curso>
        id="cursos"
        addPage="/admin/cursos/adicionar"
        getQueryKey={getCursosGetAllQueryKey}
        listHook={useCursosGetAll}
        removeHook={useCursosRemove}
        columns={columnsCursos}
        defaultSorting={{
          id: 'nome' satisfies CursosGetAllOrderBy,
          desc: false
        }}
      />
    </Wrapper>
  )
}
