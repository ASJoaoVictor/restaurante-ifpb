import { Box, Flex, Icon } from '@chakra-ui/react'
import dayjs from 'dayjs'
import { memo } from 'react'
import { RiRobot2Line } from 'react-icons/ri'
import { Tooltip } from '../ui/tooltip'

export const ChamadaDataHoraStatusDisplay = memo(ChamadaDataHoraStatusDisplayMemo)

function ChamadaDataHoraStatusDisplayMemo({
  dataHoraPrevista,
  dataHoraReal,
  automatico
}: {
  dataHoraPrevista: string | null
  dataHoraReal: string | null
  automatico: boolean
}) {
  const dataHora = dataHoraReal ?? dataHoraPrevista
  return (
    <Flex gap={2} align="center">
      <Tooltip
        content={dayjs(dataHoraPrevista).format('[Previsto em] DD [de] MMM [às] HH:mm')}
        disabled={!dataHoraReal || !dataHoraPrevista}
        positioning={{ placement: 'top' }}
      >
        <Box color="fg.muted" hidden={!dataHora} fontWeight={dataHoraReal ? 'bold' : 'normal'}>
          {dayjs(dataHora).format('HH:mm, DD [de] MMM')}
        </Box>
      </Tooltip>
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
