import { TurmaForm } from '@/components/forms/turma'
import { Wrapper } from '@/components/layout/wrapper'
import { checkRole } from '@/utils/auth-helpers'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/turmas/adicionar')({
  component: RouteComponent,
  head: () => ({ meta: [{ title: 'Adicionar turma | IFPB Meals' }] }),
  beforeLoad: ({ context }) => {
    checkRole(context, ['admin'])
  }
})

function RouteComponent() {
  return (
    <Wrapper title="Adicionar turma">
      <TurmaForm />
    </Wrapper>
  )
}
