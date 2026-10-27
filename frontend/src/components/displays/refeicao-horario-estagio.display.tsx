import { formatHoraMin } from '@/utils/formatters'
import { Box, Flex, Icon } from '@chakra-ui/react'
import { RiRobot2Line } from 'react-icons/ri'
import { Tooltip } from '../ui/tooltip'

export function RefeicaoHorarioEstagioDisplay({
  hora,
  deslocamento,
  automatico
}: {
  hora: string | null
  deslocamento: number | null
  automatico: boolean
}) {
  return (
    <Flex gap={2} align="center">
      <Box>
        {hora && <Box>{formatHoraMin(hora)}</Box>}
        {!!deslocamento && (
          <Box textStyle="xs" color="fg.muted">
            {Math.abs(deslocamento)} dia{Math.abs(deslocamento) === 1 ? '' : 's'}{' '}
            {deslocamento < 0 ? 'antes' : 'depois'}
          </Box>
        )}
      </Box>
      {automatico && (
        <Tooltip content="Automático" positioning={{ placement: 'top' }}>
          <Icon color="blue.500">
            <RiRobot2Line />
          </Icon>
        </Tooltip>
      )}
    </Flex>
  )
}
