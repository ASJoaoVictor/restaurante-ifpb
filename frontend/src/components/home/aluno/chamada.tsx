import { ChamadaAluno, InscricaoAluno, RefeicaoAluno } from '@/api/endpoints/api.schemas'
import { IntervalUpdater } from '@/components/common/interval-updater'
import { InscricaoChamada } from '@/components/forms/inscricao-chamada'
import { Tooltip } from '@/components/ui/tooltip'
import { useAuth } from '@/contexts/auth'
import { isSuspenso } from '@/utils/aluno'
import { formatDate, timeAdverb } from '@/utils/date'
import { Badge, Box, Button, Card, DataList, Flex, HStack, Stack, Text, VStack } from '@chakra-ui/react'
import { Link } from '@tanstack/react-router'
import dayjs from 'dayjs'
import capitalize from 'lodash.capitalize'
import {
  RiCalendarLine,
  RiCheckboxCircleLine,
  RiCheckLine,
  RiCloseCircleLine,
  RiCloseLine,
  RiGroupLine,
  RiRestaurantLine,
  RiTimeLine,
  RiUserUnfollowLine
} from 'react-icons/ri'
import { CancelarInscricao } from './cancelar-inscricao'

interface ChamadaProps {
  chamada: ChamadaAluno
  inscricao: InscricaoAluno | null
  refeicoesRestritas: RefeicaoAluno[]
}

export function Chamada({ chamada, inscricao, refeicoesRestritas }: ChamadaProps) {
  const { me } = useAuth()
  const { aluno } = me
  const alunoSuspenso = aluno && isSuspenso(aluno)
  const isInscrito = inscricao && !inscricao.dataHoraCancelamento
  const isCancelado = inscricao?.dataHoraCancelamento
  const isRestrito = refeicoesRestritas.some((r) => r.id === chamada.refeicaoId)
  const naoContemplado = inscricao?.status === 'rejeitada' || (chamada.estaFechada && inscricao?.status === 'pendente')

  const getTimeRemaining = () => {
    if (chamada.estaFechada) return 'Inscrições finalizadas'
    if (dayjs().isAfter(chamada.dataHoraFechamento)) return 'Encerrando em breve'
    return dayjs.duration(dayjs(chamada.dataHoraFechamento).diff(dayjs())).humanize() + ' restantes'
  }

  return (
    <Card.Root>
      <Card.Body>
        <HStack mb={6} gap={3} align="flex-start">
          <Box bg={chamada.estaFinalizada ? 'gray.400' : 'orange.solid'} color="white" p={2} borderRadius="full">
            <RiRestaurantLine size={24} />
          </Box>

          <Stack gap={0} flex={1}>
            <Text fontWeight="semibold" textStyle="md">
              {chamada.nome}
            </Text>
            <Flex color="fg.muted" textStyle="sm" align="center" gap={2}>
              <RiCalendarLine style={{ flexShrink: 0 }} />
              <IntervalUpdater>
                {() => {
                  const date = dayjs(chamada.data)
                  const dateAdverb = timeAdverb(chamada.data)
                  return [
                    dateAdverb ? capitalize(dateAdverb) : null, // Ontem, Hoje e Amanhã
                    date.format('DD MMM.'), // 01 de janeiro
                    date.format('dddd') // sexta-feira
                  ]
                    .filter(Boolean)
                    .join(', ')
                }}
              </IntervalUpdater>
            </Flex>
          </Stack>

          <VStack align="flex-end" justify="flex-start" h="full">
            {isInscrito && (
              <Tooltip content="Você está inscrito nesta chamada" positioning={{ placement: 'top' }}>
                <Badge colorPalette="blue">
                  <RiCheckLine />
                  Inscrito {inscricao.suap && 'pelo SUAP'}
                </Badge>
              </Tooltip>
            )}

            {isCancelado && (
              <Tooltip content="Você cancelou sua inscrição nesta chamada" positioning={{ placement: 'top' }}>
                <Badge colorPalette="red">
                  <RiCloseLine />
                  Cancelado
                </Badge>
              </Tooltip>
            )}

            {inscricao?.status === 'aceita' && (
              <Tooltip content="Você foi contemplado nesta chamada" positioning={{ placement: 'top' }}>
                <Badge colorPalette="green">
                  <RiCheckLine />
                  Contemplado
                </Badge>
              </Tooltip>
            )}

            {naoContemplado && (
              <Tooltip content="Infelizmente você não foi contemplado nesta chamada" positioning={{ placement: 'top' }}>
                <Badge colorPalette="red">
                  <RiCloseLine />
                  Não contemplado
                </Badge>
              </Tooltip>
            )}

            {inscricao?.presenca === 'presente' && (
              <Tooltip content="Você compareceu e pegou a refeição" positioning={{ placement: 'top' }}>
                <Badge colorPalette="green">
                  <RiCheckLine />
                  Presente
                </Badge>
              </Tooltip>
            )}

            {inscricao?.presenca === 'ausente' && (
              <Tooltip content="Você não compareceu para pegar a refeição" positioning={{ placement: 'top' }}>
                <Badge colorPalette="red">
                  <RiCloseLine />
                  Ausente
                </Badge>
              </Tooltip>
            )}

            {inscricao?.presenca === 'desistente' && (
              <Tooltip content="Você desistiu de pegar a refeição" positioning={{ placement: 'top' }}>
                <Badge colorPalette="orange">
                  <RiUserUnfollowLine />
                  Desistente
                </Badge>
              </Tooltip>
            )}
          </VStack>
        </HStack>

        <Card.Description as="div">
          <DataList.Root orientation="horizontal">
            {chamada.dataHoraFechamento && (
              <DataList.Item>
                <DataList.ItemLabel minW={0} color="orange.solid">
                  <RiTimeLine size={16} />
                </DataList.ItemLabel>
                <DataList.ItemValue display="block">
                  <Box>
                    Até <IntervalUpdater>{() => formatDate(chamada.dataHoraFechamento, true)}</IntervalUpdater>
                  </Box>
                  <Box color="orange.solid" textStyle="xs">
                    <IntervalUpdater>{() => getTimeRemaining()}</IntervalUpdater>
                  </Box>
                </DataList.ItemValue>
              </DataList.Item>
            )}

            {chamada.vagas && (
              <DataList.Item>
                <DataList.ItemLabel minW={0} color="blue.solid">
                  <RiGroupLine size={16} />
                </DataList.ItemLabel>
                <DataList.ItemValue fontWeight="medium">{chamada.vagas} vagas</DataList.ItemValue>
              </DataList.Item>
            )}

            {chamada.dataHoraDivulgacaoResultado && !chamada.resultadoDivulgado && (
              <DataList.Item>
                <DataList.ItemLabel minW={0} color="purple.solid">
                  <RiCheckboxCircleLine size={16} />
                </DataList.ItemLabel>
                <DataList.ItemValue fontWeight="medium">
                  Resultado{' '}
                  <IntervalUpdater>{() => formatDate(chamada.dataHoraDivulgacaoResultado, true)}</IntervalUpdater>
                </DataList.ItemValue>
              </DataList.Item>
            )}

            {chamada.podeInscrever && !inscricao && isRestrito && (
              <DataList.Item>
                <DataList.ItemLabel minW={0} color="red.solid">
                  <RiCloseCircleLine size={16} />
                </DataList.ItemLabel>
                <DataList.ItemValue color="fg.error" fontWeight="medium" textStyle="xs">
                  Você não pode se inscrever nesta chamada porque possui edital de alimentação. Por favor, se inscreva
                  pelo SUAP.
                </DataList.ItemValue>
              </DataList.Item>
            )}
          </DataList.Root>
        </Card.Description>
      </Card.Body>

      <Card.Footer>
        {chamada.podeInscrever && !inscricao && (
          <InscricaoChamada chamada={chamada} disabled={!!alunoSuspenso || isRestrito} />
        )}

        {isInscrito && chamada.podeCancelarInscricao && <CancelarInscricao chamada={chamada} />}

        {isCancelado && (
          <Button variant="subtle" colorPalette="orange" flex={1} disabled>
            <RiCloseLine />
            Inscrição cancelada
          </Button>
        )}

        {chamada.resultadoDivulgado && (
          <Button asChild variant="subtle" colorPalette="blue" flex={1}>
            <Link to="/resultado/$id" params={{ id: chamada.id }}>
              Resultado
            </Link>
          </Button>
        )}
      </Card.Footer>
    </Card.Root>
  )
}
