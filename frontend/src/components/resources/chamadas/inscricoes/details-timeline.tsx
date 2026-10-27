import { ChamadaComInscricoes } from '@/api/endpoints/api.schemas'
import { TimelineConnector, TimelineContent, TimelineItem, TimelineRoot, TimelineTitle } from '@/components/ui/timeline'
import { Tooltip } from '@/components/ui/tooltip'
import { CHAMADA_STATUS_COLOR } from '@/enums/chamada'
import { TimelineDescription } from '@chakra-ui/react'
import dayjs from 'dayjs'
import { RiArchiveLine, RiCloseLine, RiDoorOpenLine, RiLockLine, RiMegaphoneLine, RiRobot2Line } from 'react-icons/ri'

export function ChamadaDetailsTimeline({ chamada }: { chamada: ChamadaComInscricoes }) {
  const steps = [
    [
      'Abertura',
      RiDoorOpenLine,
      CHAMADA_STATUS_COLOR.aberta,
      chamada.chamada.dataHoraAbertura,
      chamada.chamada.dataHoraAberturaReal,
      chamada.chamada.aberturaAutomatica
    ],
    [
      'Fechamento',
      RiLockLine,
      CHAMADA_STATUS_COLOR.fechada,
      chamada.chamada.dataHoraFechamento,
      chamada.chamada.dataHoraFechamentoReal,
      chamada.chamada.fechamentoAutomatico
    ],
    [
      'Divulgação',
      RiMegaphoneLine,
      CHAMADA_STATUS_COLOR.divulgada,
      chamada.chamada.dataHoraDivulgacaoResultado,
      chamada.chamada.dataHoraDivulgacaoResultadoReal,
      chamada.chamada.divulgacaoAutomatica
    ],
    [
      'Finalização',
      RiCloseLine,
      CHAMADA_STATUS_COLOR.finalizada,
      chamada.chamada.dataHoraFinalizacao,
      chamada.chamada.dataHoraFinalizacaoReal,
      chamada.chamada.finalizacaoAutomatica
    ],
    [
      'Encerramento',
      RiArchiveLine,
      CHAMADA_STATUS_COLOR.encerrada,
      chamada.chamada.dataHoraEncerramento,
      chamada.chamada.dataHoraEncerramentoReal,
      chamada.chamada.encerramentoAutomatico
    ]
  ] as const

  return (
    <TimelineRoot size="xl">
      {steps.map(([title, Icon, color, date, realDate, isAutomatic], i) => (
        <TimelineItem
          colorPalette={!realDate ? 'gray' : color}
          _last={{ '& .chakra-timeline__content': { pb: 0 } }}
          key={i}
        >
          <TimelineConnector>
            <Icon />
          </TimelineConnector>
          <TimelineContent>
            <TimelineTitle>
              {title}
              {isAutomatic && (
                <Tooltip content="Automático">
                  <RiRobot2Line />
                </Tooltip>
              )}
            </TimelineTitle>
            <TimelineDescription hidden={!realDate && !date}>
              {dayjs(realDate || date).format('HH:mm • DD [de] MMMM')}
            </TimelineDescription>
          </TimelineContent>
        </TimelineItem>
      ))}
    </TimelineRoot>
  )
}
