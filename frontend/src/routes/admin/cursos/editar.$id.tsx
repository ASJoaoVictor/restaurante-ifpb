import { useCursosGetOne } from '@/api/endpoints/cursos'
import { ErrorComponent } from '@/components/error/error-component'
import { CursoForm } from '@/components/forms/curso'
import { Wrapper } from '@/components/layout/wrapper'
import { checkRole } from '@/utils/auth-helpers'
import { Skeleton } from '@chakra-ui/react'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/cursos/editar/$id')({
  component: RouteComponent,
  head: () => ({ meta: [{ title: 'Editar curso | IFPB Meals' }] }),
  beforeLoad: ({ context }) => {
    checkRole(context, ['admin'])
  }
})

function RouteComponent() {
  return (
    <Wrapper title="Editar curso">
      <Editar />
    </Wrapper>
  )
}

function Editar() {
  const { id } = Route.useParams()
  const { data, isLoading, error, refetch } = useCursosGetOne(id)

  if (isLoading) return <Skeleton h="sm" />
  if (error) return <ErrorComponent error={error} retry={refetch} />

  return <CursoForm edit={data} />
}
