import { ChamadaComInscricoes } from '@/api/endpoints/api.schemas'
import { IntervalUpdater } from '@/components/common/interval-updater'
import { HoverCardArrow, HoverCardContent, HoverCardRoot, HoverCardTrigger } from '@/components/ui/hover-card'
import { ProgressCircleRing, ProgressCircleRoot } from '@/components/ui/progress-circle'
import { Tooltip } from '@/components/ui/tooltip'
import {
  CHAMADA_PROXIMO_STATUS_AUTOMACAO,
  CHAMADA_PROXIMO_STATUS_DATA_HORA,
  CHAMADA_PROXIMO_STATUS_NOMES
} from '@/enums/chamada'
import { Box, HStack, Icon, SimpleGrid, Stat } from '@chakra-ui/react'
import dayjs from 'dayjs'
import capitalize from 'lodash.capitalize'
import {
  RiCalendarLine,
  RiCheckLine,
  RiCircleLine,
  RiCloseLine,
  RiGroupLine,
  RiTimeLine,
  RiTodoLine,
  RiUserUnfollowLine
} from 'react-icons/ri'
import { ChamadaDetailsTimeline } from './details-timeline'

export function ChamadaDetails({ chamada }: { chamada: ChamadaComInscricoes }) {
  const presentes = chamada.inscricoes.filter((i) => i.inscricao.presenca === 'presente').length
  const ausentes = chamada.inscricoes.filter((i) => i.inscricao.presenca === 'ausente').length
  const desistentes = chamada.inscricoes.filter((i) => i.inscricao.presenca === 'desistente').length
  const pendentes = chamada.inscricoes.filter((i) => i.inscricao.presenca === 'pendente').length
  const naoPendentes = chamada.inscricoes.filter((i) => i.inscricao.presenca !== 'pendente').length

  const proximoStatusNome = CHAMADA_PROXIMO_STATUS_NOMES[chamada.chamada.status]
  const dataHoraProximoStatus = CHAMADA_PROXIMO_STATUS_DATA_HORA[chamada.chamada.status](chamada.chamada)
  const automacaoProximoStatus = CHAMADA_PROXIMO_STATUS_AUTOMACAO[chamada.chamada.status](chamada.chamada)

  return (
    <SimpleGrid columns={{ base: 1, sm: 2, md: 4 }} gap={4}>
      {/* Data */}
      <Stat.Root borderWidth="1px" p={4} rounded="md">
        <HStack justify="space-between">
          <Stat.Label>Data da refeição</Stat.Label>
          <Icon color="fg.muted">
            <RiCalendarLine />
          </Icon>
        </HStack>
        <Stat.ValueText alignItems="baseline">{dayjs(chamada.chamada.data).format('DD/MM/YYYY')}</Stat.ValueText>
        <Stat.HelpText>{dayjs(chamada.chamada.data).format('dddd')}</Stat.HelpText>
      </Stat.Root>

      {/* Inscritos */}
      <Stat.Root borderWidth="1px" p={4} rounded="md">
        <HStack justify="space-between">
          <Stat.Label>Inscritos</Stat.Label>
          <Icon color="fg.muted">
            <RiGroupLine />
          </Icon>
        </HStack>
        <HStack>
          <Stat.ValueText alignItems="baseline">
            {chamada.inscricoes.length}
            <Stat.ValueUnit hidden={!chamada.chamada.vagas}>/{chamada.chamada.vagas}</Stat.ValueUnit>
          </Stat.ValueText>

          <Box flex={1} />

          {chamada.chamada.vagas && (
            <ProgressCircleRoot
              size="xs"
              value={Math.min(chamada.inscricoes.length, chamada.chamada.vagas)}
              max={chamada.chamada.vagas}
              colorPalette={chamada.inscricoes.length > chamada.chamada.vagas ? 'red' : 'green'}
            >
              <ProgressCircleRing />
            </ProgressCircleRoot>
          )}
        </HStack>
        {chamada.chamada.vagas === null ? (
          <Stat.HelpText>Vagas ilimitadas</Stat.HelpText>
        ) : chamada.inscricoes.length > chamada.chamada.vagas ? (
          <Stat.HelpText>Além das vagas</Stat.HelpText>
        ) : chamada.chamada.vagas === chamada.inscricoes.length ? (
          <Stat.HelpText>Todas as vagas preenchidas</Stat.HelpText>
        ) : (
          <Stat.HelpText>
            {Math.round((chamada.inscricoes.length / chamada.chamada.vagas) * 100)}% das vagas preenchidas
          </Stat.HelpText>
        )}
      </Stat.Root>

      {/* Status */}
      <HoverCardRoot lazyMount>
        <HoverCardTrigger textAlign="left" asChild tabIndex={0} cursor="help">
          <Stat.Root borderWidth="1px" p={4} rounded="md">
            <HStack justify="space-between">
              <Stat.Label>{proximoStatusNome || 'Encerrada'}</Stat.Label>
              <Icon color="fg.muted">
                <RiTimeLine />
              </Icon>
            </HStack>
            <Stat.ValueText alignItems="baseline">
              {dataHoraProximoStatus ? (
                <IntervalUpdater>
                  {() =>
                    dayjs(dataHoraProximoStatus).isBefore()
                      ? dayjs(dataHoraProximoStatus).format('DD/MM [às] HH:mm')
                      : capitalize(dayjs(dataHoraProximoStatus).fromNow())
                  }
                </IntervalUpdater>
              ) : proximoStatusNome ? (
                'Horário não definido'
              ) : (
                'Encerrada'
              )}
            </Stat.ValueText>
            <Stat.HelpText>
              {automacaoProximoStatus === null ? 'Encerrada' : automacaoProximoStatus ? 'Automático' : 'Manual'}
            </Stat.HelpText>
          </Stat.Root>
        </HoverCardTrigger>
        <HoverCardContent>
          <HoverCardArrow />
          <ChamadaDetailsTimeline chamada={chamada} />
        </HoverCardContent>
      </HoverCardRoot>

      {/* Presença */}
      <Stat.Root borderWidth="1px" p={4} rounded="md">
        <HStack justify="space-between">
          <Stat.Label>Presença</Stat.Label>
          <Icon color="fg.muted">
            <RiTodoLine />
          </Icon>
        </HStack>
        <Stat.ValueText alignItems="center" flexWrap="wrap" gapX={4}>
          <Tooltip content="Presentes" positioning={{ placement: 'top' }}>
            <HStack>
              {presentes}
              <Icon color="green.solid">
                <RiCheckLine />
              </Icon>
            </HStack>
          </Tooltip>

          <Tooltip content="Ausentes" positioning={{ placement: 'top' }}>
            <HStack>
              {ausentes}
              <Icon color="red.solid">
                <RiCloseLine />
              </Icon>
            </HStack>
          </Tooltip>

          <Tooltip content="Desistentes" positioning={{ placement: 'top' }}>
            <HStack>
              {desistentes}
              <Icon color="orange.solid">
                <RiUserUnfollowLine />
              </Icon>
            </HStack>
          </Tooltip>

          <Tooltip content="Pendentes" positioning={{ placement: 'top' }}>
            <HStack>
              {pendentes}
              <Icon color="purple.solid">
                <RiCircleLine />
              </Icon>
            </HStack>
          </Tooltip>
        </Stat.ValueText>
        <Stat.HelpText>{Math.round((presentes / (naoPendentes || 1)) * 100)}% de presença</Stat.HelpText>
      </Stat.Root>
    </SimpleGrid>
  )
}
