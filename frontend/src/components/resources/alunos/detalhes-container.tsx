import { Aluno } from '@/api/endpoints/api.schemas'
import { memo, PropsWithChildren } from 'react'
import { HoverCardArrow, HoverCardContent, HoverCardRoot, HoverCardTrigger } from '@/components/ui/hover-card'
import { AlunoDetalhes } from './detalhes'

export const AlunoDetalhesPopover = memo(AlunoDetalhesPopoverMemo)

function AlunoDetalhesPopoverMemo({
  aluno,
  children
}: { aluno: Omit<Aluno, 'refeicoesRestritas'> } & PropsWithChildren) {
  return (
    <HoverCardRoot positioning={{ placement: 'right' }} lazyMount>
      <HoverCardTrigger asChild>{children}</HoverCardTrigger>

      <HoverCardContent p={4}>
        <HoverCardArrow />
        <AlunoDetalhes alunoId={aluno.id} />
      </HoverCardContent>
    </HoverCardRoot>
  )
}
