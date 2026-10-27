import { CursoForm } from '@/components/forms/curso'
import { Wrapper } from '@/components/layout/wrapper'
import { checkRole } from '@/utils/auth-helpers'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/cursos/adicionar')({
  component: RouteComponent,
  head: () => ({ meta: [{ title: 'Adicionar curso | IFPB Meals' }] }),
  beforeLoad: ({ context }) => {
    checkRole(context, ['admin'])
  }
})

function RouteComponent() {
  return (
    <Wrapper title="Adicionar curso">
      <CursoForm />
    </Wrapper>
  )
}
