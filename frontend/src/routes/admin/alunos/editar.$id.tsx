import { useAlunosGetOne } from '@/api/endpoints/alunos'
import { ErrorComponent } from '@/components/error/error-component'
import { AlunoForm } from '@/components/forms/alunos'
import { Wrapper } from '@/components/layout/wrapper'
import { checkRole } from '@/utils/auth-helpers'
import { Skeleton } from '@chakra-ui/react'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/alunos/editar/$id')({
  component: RouteComponent,
  head: () => ({ meta: [{ title: 'Editar aluno | IFPB Meals' }] }),
  beforeLoad: ({ context }) => {
    checkRole(context, ['admin'])
  }
})

function RouteComponent() {
  return (
    <Wrapper title="Editar aluno">
      <Editar />
    </Wrapper>
  )
}

function Editar() {
  const { id } = Route.useParams()
  const { data, isLoading, error, refetch } = useAlunosGetOne(id)

  if (isLoading) return <Skeleton h="sm" />
  if (error) return <ErrorComponent error={error} retry={refetch} />

  return <AlunoForm edit={data} />
}
