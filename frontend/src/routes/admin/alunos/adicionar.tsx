import { AlunoForm } from '@/components/forms/alunos'
import { Wrapper } from '@/components/layout/wrapper'
import { checkRole } from '@/utils/auth-helpers'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/alunos/adicionar')({
  component: RouteComponent,
  head: () => ({ meta: [{ title: 'Adicionar aluno | IFPB Meals' }] }),
  beforeLoad: ({ context }) => {
    checkRole(context, ['admin'])
  }
})

function RouteComponent() {
  return (
    <Wrapper title="Adicionar aluno">
      <AlunoForm />
    </Wrapper>
  )
}
