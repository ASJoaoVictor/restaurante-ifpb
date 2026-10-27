import { Chamada } from '@/api/endpoints/api.schemas'
import { CHAMADA_STATUS_COLOR, CHAMADA_STATUS_NOME } from '@/enums/chamada'
import { Badge } from '@chakra-ui/react'
import { memo } from 'react'

export const ChamadaStatusDisplay = memo(ChamadaStatusDisplayMemo)

function ChamadaStatusDisplayMemo({ chamada }: { chamada: Chamada }) {
  return (
    <Badge variant="solid" colorPalette={CHAMADA_STATUS_COLOR[chamada.status]}>
      {CHAMADA_STATUS_NOME[chamada.status]}
    </Badge>
  )
}
