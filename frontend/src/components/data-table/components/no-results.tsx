import { RiSearchLine } from 'react-icons/ri'
import { EmptyState } from '../../ui/empty-state'

export function TableNoResults() {
  return <EmptyState icon={<RiSearchLine />} title="Sem resultados" />
}
