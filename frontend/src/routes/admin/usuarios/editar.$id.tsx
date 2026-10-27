import { useUsersGetOne } from '@/api/endpoints/users'
import { ErrorComponent } from '@/components/error/error-component'
import { UsuarioForm } from '@/components/forms/usuario'
import { Wrapper } from '@/components/layout/wrapper'
import { checkRole } from '@/utils/auth-helpers'
import { Skeleton } from '@chakra-ui/react'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/usuarios/editar/$id')({
  head: () => ({ meta: [{ title: 'Editar usuário | IFPB Meals' }] }),
  component: RouteComponent,
  beforeLoad: ({ context }) => {
    checkRole(context, ['admin'])
  }
})

function RouteComponent() {
  return (
    <Wrapper title="Editar usuário">
      <Editar />
    </Wrapper>
  )
}
function Editar() {
  const { id } = Route.useParams()
  const { data, isLoading, error, refetch } = useUsersGetOne(id)

  if (isLoading) return <Skeleton h="sm" />
  if (error) return <ErrorComponent error={error} retry={refetch} />

  return <UsuarioForm edit={data} />
}
