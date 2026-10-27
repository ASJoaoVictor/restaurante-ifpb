import { ChamadaComTotalInscritosDto } from '@/api/endpoints/api.schemas'
import { useChamadasGetRecent } from '@/api/endpoints/chamadas'
import { IntervalUpdater } from '@/components/common/interval-updater'
import { ErrorComponent } from '@/components/error/error-component'
import { useAuth } from '@/contexts/auth'
import { CHAMADA_STATUS_COLOR, CHAMADA_STATUS_NOME } from '@/enums/chamada'
import {
  Box,
  Button,
  CardRoot,
  Center,
  chakra,
  Badge as ChakraBadge,
  Flex,
  For,
  Heading,
  Progress,
  Stack,
  Text
} from '@chakra-ui/react'
import { Link } from '@tanstack/react-router'
import dayjs from 'dayjs'
import { RiArrowRightLine } from 'react-icons/ri'
import { Empty } from './empty'
import { ChamadasLoading } from './loading'

const Badge = chakra(ChakraBadge, {
  base: {
    textTransform: 'capitalize',
    px: 3,
    py: 1,
    borderRadius: 'lg',
    fontSize: 'sm',
    fontWeight: 'medium',
    textAlign: 'center'
  }
})

export function ChamadasRecentes() {
  const { data, error, isLoading, refetch } = useChamadasGetRecent()

  if (isLoading) return <ChamadasLoading />
  if (error) return <ErrorComponent error={error} retry={refetch} />

  return (
    <>
      <For fallback={<Empty />} each={data}>
        {(item, index) => <ChamadaItem key={index} chamada={item} />}
      </For>
      <Center hidden={!data?.length}>
        <Button variant="ghost" asChild>
          <Link to="/admin/chamadas">
            Ver todas as chamadas <RiArrowRightLine />
          </Link>
        </Button>
      </Center>
    </>
  )
}

function ChamadaItem({ chamada }: { chamada: ChamadaComTotalInscritosDto }) {
  const { me } = useAuth()

  const getTimeRemaining = () => {
    if (chamada.estaFechada) return 'Inscrições finalizadas'
    if (dayjs().isAfter(chamada.dataHoraFechamento)) return 'Encerrando em breve'
    return dayjs.duration(dayjs(chamada.dataHoraFechamento).diff(dayjs())).humanize() + ' restantes'
  }

  const statusName = CHAMADA_STATUS_NOME[chamada.status]
  const color = CHAMADA_STATUS_COLOR[chamada.status]

  return (
    <CardRoot
      asChild
      p={4}
      _hover={{ bg: 'colorPalette.panel' }}
      _focusVisible={{ bg: 'colorPalette.panel' }}
      transition="background-color 0.2s"
    >
      <Link
        to={me.user?.isGestor || me.user?.isAdmin ? '/admin/chamadas/$id/inscricoes' : '/admin/chamadas/$id/presenca'}
        params={{ id: chamada.id }}
      >
        <Stack gap={6} direction="row" justify="space-between" align={{ base: 'start', md: 'center' }}>
          <Box color="fg.muted" textStyle="sm" gap={2} flex={1}>
            <Heading as="h2" size="md">
              {chamada.nome}
            </Heading>
            <Text textStyle="sm" color="fg.muted">
              {dayjs(chamada.data).format('DD [de] MMMM')}
            </Text>
          </Box>

          <Badge colorPalette={color} variant="solid">
            {statusName}
          </Badge>
        </Stack>

        <Stack gap={3}>
          <Stack direction="row" justify="space-between" align="center" w="full" gap={4}>
            <Flex align="center" gapX={2}>
              <Text fontSize="sm">
                {Math.min(chamada.totalInscritos, Number(chamada.vagas))}/{chamada.vagas}
              </Text>
            </Flex>

            <Box flex={1} w="full">
              {chamada.vagas && chamada.totalInscritos !== null && (
                <Progress.Root w="full" max={chamada.vagas} value={chamada.totalInscritos}>
                  <Progress.Track>
                    <Progress.Range />
                  </Progress.Track>
                </Progress.Root>
              )}
            </Box>

            <Box color="orange.solid" textStyle="xs">
              <IntervalUpdater>{() => getTimeRemaining()}</IntervalUpdater>
            </Box>
          </Stack>
        </Stack>
      </Link>
    </CardRoot>
  )
}
