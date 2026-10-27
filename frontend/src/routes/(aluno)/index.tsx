import { AlunoFaltas } from '@/components/home/aluno/aluno-faltas'
import { AlunoDashboard } from '@/components/home/aluno/aluno-dashboard'
import { Wrapper } from '@/components/layout/wrapper'
import { checkLogin } from '@/utils/auth-helpers'
import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/(aluno)/')({
  component: RouteComponent,
  head: () => ({ meta: [{ title: 'IFPB Meals' }] }),
  beforeLoad: ({ context }) => {
    checkLogin(context)
    if (!context.me.user?.isAluno) throw redirect({ to: '/admin', replace: true })
  }
})

function RouteComponent() {
  return (
    <Wrapper>
      <AlunoFaltas />
      <AlunoDashboard />
    </Wrapper>
  )
}
