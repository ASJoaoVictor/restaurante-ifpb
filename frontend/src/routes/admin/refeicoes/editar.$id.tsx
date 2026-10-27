import { useRefeicoesGetOne } from '@/api/endpoints/refeicoes'
import { ErrorComponent } from '@/components/error/error-component'
import { RefeicaoForm } from '@/components/forms/refeicao'
import { Wrapper } from '@/components/layout/wrapper'
import { checkRole } from '@/utils/auth-helpers'
import { Skeleton } from '@chakra-ui/react'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/refeicoes/editar/$id')({
  component: RouteComponent,
  head: () => ({ meta: [{ title: 'Editar refeição | IFPB Meals' }] }),
  beforeLoad: ({ context }) => {
    checkRole(context, ['admin', 'gestor'])
  }
})

function RouteComponent() {
  return (
    <Wrapper title="Editar refeição">
      <Editar />
    </Wrapper>
  )
}

function Editar() {
  const { id } = Route.useParams()
  const { data, isLoading, error, refetch } = useRefeicoesGetOne(id)

  if (isLoading) return <Skeleton h="sm" />
  if (error) return <ErrorComponent error={error} retry={refetch} />

  return <RefeicaoForm edit={data} />
}
