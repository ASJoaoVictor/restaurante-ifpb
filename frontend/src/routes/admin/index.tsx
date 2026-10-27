import { MyUserRolesItem } from '@/api/endpoints/api.schemas'
import { HomeAdmin } from '@/components/home/admin'
import { Wrapper } from '@/components/layout/wrapper'
import { useAuth } from '@/contexts/auth'
import { checkRole } from '@/utils/auth-helpers'
import { getNome, getSaudacao } from '@/utils/formatters'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/')({
  component: RouteComponent,
  head: () => ({ meta: [{ title: 'Administração | IFPB Meals' }] }),
  beforeLoad: ({ context }) => {
    checkRole(context, ['admin', 'gestor', 'colaborador'])
  }
})

function RouteComponent() {
  const { me } = useAuth()

  const subtitles: Record<Exclude<MyUserRolesItem, 'aluno'>, string> = {
    admin: 'Gerencie cursos, chamadas, refeições e configurações do sistema.',
    gestor: 'Gerencie chamadas, refeições e alunos.',
    colaborador: 'Gerencie presença de alunos e acompanhe a lista.'
  }

  const nome = getNome(me.user?.name)
  const saudacao = getSaudacao()
  const titulo = `${saudacao}, ${nome}.`

  const role = me.user?.roles.find((r) => r !== 'aluno')

  return (
    <Wrapper title={titulo} subtitle={role ? subtitles[role] : 'Bem-vindo!'}>
      <HomeAdmin />
    </Wrapper>
  )
}
