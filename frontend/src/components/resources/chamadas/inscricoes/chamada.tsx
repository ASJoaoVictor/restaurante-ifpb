import { ChamadaComInscricoes } from '@/api/endpoints/api.schemas'
import { Stack } from '@chakra-ui/react'
import { ChamadaActions } from './actions'
import { ChamadaDetails } from './details'
import { InscricoesTable } from './inscricoes-table'

export function Chamada({ chamada }: { chamada: ChamadaComInscricoes }) {
  return (
    <Stack gap={4}>
      <ChamadaDetails chamada={chamada} />
      <ChamadaActions chamada={chamada} />
      <InscricoesTable chamada={chamada} />
    </Stack>
  )
}
