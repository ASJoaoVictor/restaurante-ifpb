import { ChamadaForm } from '@/components/forms/chamada'
import { Wrapper } from '@/components/layout/wrapper'
import { checkRole } from '@/utils/auth-helpers'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/chamadas/adicionar')({
  component: RouteComponent,
  head: () => ({ meta: [{ title: 'Adicionar chamada | IFPB Meals' }] }),
  beforeLoad: ({ context }) => {
    checkRole(context, ['admin', 'gestor'])
  }
})

function RouteComponent() {
  return (
    <Wrapper title="Adicionar chamada">
      <ChamadaForm />
    </Wrapper>
  )
}
