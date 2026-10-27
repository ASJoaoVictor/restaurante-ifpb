import { UsuarioForm } from '@/components/forms/usuario'
import { Wrapper } from '@/components/layout/wrapper'
import { checkRole } from '@/utils/auth-helpers'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/usuarios/adicionar')({
  component: RouteComponent,
  head: () => ({ meta: [{ title: 'Adicionar usuário | IFPB Meals' }] }),
  beforeLoad: ({ context }) => {
    checkRole(context, ['admin'])
  }
})

function RouteComponent() {
  return (
    <Wrapper title="Adicionar usuário">
      <UsuarioForm />
    </Wrapper>
  )
}
