import { RefeicaoForm } from '@/components/forms/refeicao'
import { Wrapper } from '@/components/layout/wrapper'
import { checkRole } from '@/utils/auth-helpers'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/refeicoes/adicionar')({
  component: RouteComponent,
  head: () => ({ meta: [{ title: 'Adicionar refeição | IFPB Meals' }] }),
  beforeLoad: ({ context }) => {
    checkRole(context, ['admin', 'gestor'])
  }
})

function RouteComponent() {
  return (
    <Wrapper title="Adicionar refeição">
      <RefeicaoForm />
    </Wrapper>
  )
}
