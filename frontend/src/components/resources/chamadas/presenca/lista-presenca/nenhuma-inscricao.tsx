import { EmptyState } from '@/components/ui/empty-state'
import { RiPencilLine } from 'react-icons/ri'

export function NenhumaInscricao() {
  return (
    <EmptyState
      icon={<RiPencilLine />}
      title="Nenhuma inscrição"
      description="Nenhum aluno se inscreveu nessa chamada ainda"
    />
  )
}
