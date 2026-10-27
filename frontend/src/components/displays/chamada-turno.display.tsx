import { Chamada } from '@/api/endpoints/api.schemas'
import { TURNOS } from '@/enums/turnos'
import { Box, Flex, Icon } from '@chakra-ui/react'
import { memo } from 'react'
import { RiErrorWarningLine } from 'react-icons/ri'
import { Tooltip } from '../ui/tooltip'

export const ChamadaTurnoDisplay = memo(ChamadaTurnoDisplayMemo)

function ChamadaTurnoDisplayMemo({ chamada }: { chamada: Pick<Chamada, 'turno' | 'priorizarMesmoTurno'> }) {
  if (!chamada.turno) return null

  return (
    <Flex align="center" gap={2}>
      <Box>{TURNOS[chamada.turno]}</Box>
      {chamada.priorizarMesmoTurno && (
        <Tooltip content="Priorizar mesmo turno" positioning={{ placement: 'top' }}>
          <Icon color="orange.solid">
            <RiErrorWarningLine />
          </Icon>
        </Tooltip>
      )}
    </Flex>
  )
}
