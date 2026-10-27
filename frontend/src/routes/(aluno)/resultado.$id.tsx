import { useChamadasListaAprovados } from '@/api/endpoints/chamadas'
import { columnsAprovados } from '@/components/columns/alunos-aprovados.columns'
import { ErrorComponent } from '@/components/error/error-component'
import { Wrapper } from '@/components/layout/wrapper'
import { ListaAprovadosTable } from '@/components/resources/chamadas/resultado'
import { TableSkeleton } from '@/components/resources/chamadas/resultado/table-skeleton'
import { checkRole } from '@/utils/auth-helpers'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(aluno)/resultado/$id')({
  head: () => ({ meta: [{ title: 'Resultado da chamada | IFPB Meals' }] }),
  beforeLoad: ({ context }) => {
    checkRole(context, ['aluno'])
  },
  component: RouteComponent
})

function RouteComponent() {
  const { id } = Route.useParams()
  const { data, isLoading, error, refetch } = useChamadasListaAprovados(id)

  const titulo = isLoading
    ? 'Carregando resultado...'
    : data?.chamada?.nome
      ? `Resultado da chamada - ${data.chamada.nome}`
      : 'Resultado da chamada'

  return (
    <Wrapper title={titulo}>
      {isLoading && <TableSkeleton columns={columnsAprovados} pageSize={5} />}
      {error && <ErrorComponent error={error} retry={refetch} />}
      {data && <ListaAprovadosTable data={data} />}
    </Wrapper>
  )
}
