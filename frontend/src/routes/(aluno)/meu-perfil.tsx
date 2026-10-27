import { PerfilAluno } from '@/components/home/perfil-aluno/perfil-aluno'
import { Wrapper } from '@/components/layout/wrapper'
import { checkLogin } from '@/utils/auth-helpers'
import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/(aluno)/meu-perfil')({
  component: RouteComponent,
  head: () => ({ meta: [{ title: 'Meu Perfil | IFPB Meals' }] }),
  beforeLoad: ({ context }) => {
    checkLogin(context)
    if (!context.me.user?.isAluno) throw redirect({ to: '/admin', replace: true })
  }
})

function RouteComponent() {
  return (
    <Wrapper>
      <PerfilAluno />
    </Wrapper>
  )
}
