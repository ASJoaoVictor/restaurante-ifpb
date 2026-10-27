import { useTurmasGetOne } from '@/api/endpoints/turmas'
import { ErrorComponent } from '@/components/error/error-component'
import { TurmaForm } from '@/components/forms/turma'
import { Wrapper } from '@/components/layout/wrapper'
import { checkRole } from '@/utils/auth-helpers'
import { Skeleton } from '@chakra-ui/react'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/turmas/editar/$id')({
  component: RouteComponent,
  head: () => ({ meta: [{ title: 'Editar turma | IFPB Meals' }] }),
  beforeLoad: ({ context }) => {
    checkRole(context, ['admin'])
  }
})

function RouteComponent() {
  return (
    <Wrapper title="Editar turma">
      <Editar />
    </Wrapper>
  )
}
function Editar() {
  const { id } = Route.useParams()
  const { data, isLoading, error, refetch } = useTurmasGetOne(id)

  if (isLoading) return <Skeleton h="sm" />
  if (error) return <ErrorComponent error={error} retry={refetch} />

  return <TurmaForm edit={data} />
}
