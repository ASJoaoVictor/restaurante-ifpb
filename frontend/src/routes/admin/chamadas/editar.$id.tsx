import { useChamadasGetOne } from '@/api/endpoints/chamadas'
import { ErrorComponent } from '@/components/error/error-component'
import { ChamadaForm } from '@/components/forms/chamada'
import { Wrapper } from '@/components/layout/wrapper'
import { checkRole } from '@/utils/auth-helpers'
import { Skeleton } from '@chakra-ui/react'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/chamadas/editar/$id')({
  component: RouteComponent,
  head: () => ({ meta: [{ title: 'Editar chamada | IFPB Meals' }] }),
  beforeLoad: ({ context }) => {
    checkRole(context, ['admin', 'gestor'])
  }
})

function RouteComponent() {
  return (
    <Wrapper title="Editar chamada">
      <Editar />
    </Wrapper>
  )
}

function Editar() {
  const { id } = Route.useParams()
  const { data, isLoading, error, refetch } = useChamadasGetOne(id)

  if (isLoading) return <Skeleton h="sm" />
  if (error) return <ErrorComponent error={error} retry={refetch} />

  return <ChamadaForm edit={data} />
}
