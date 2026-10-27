import { getChamadasDashboardQueryKey, useChamadasDashboard } from '@/api/endpoints/chamadas'
import { Badge, Box, Button, Center, Flex, Heading, SimpleGrid, Span, Stack, Text } from '@chakra-ui/react'
import { RiArrowRightLine, RiLockLine, RiMegaphoneLine, RiPencilLine, RiTimeLine } from 'react-icons/ri'
import { HomeLoading } from './loading'
import { EmptyState } from '@/components/ui/empty-state'
import { ErrorComponent } from '@/components/error/error-component'
import { Chamada } from './chamada'

export function AlunoDashboard() {
  const { data, error, isLoading, refetch } = useChamadasDashboard({
    query: {
      queryKey: getChamadasDashboardQueryKey(),
      refetchInterval: 10000
    }
  })

  if (isLoading) return <HomeLoading />
  if (error) return <ErrorComponent error={error} retry={refetch} />

  if (
    data?.chamadasAbertas.length === 0 &&
    data?.chamadasFechadas.length === 0 &&
    data?.chamadasAnteriores.length === 0
  ) {
    return (
      <EmptyState
        icon={<RiMegaphoneLine />}
        title="Nenhuma chamada encontrada"
        description="Não há chamadas disponíveis para inscrição no momento"
      />
    )
  }

  return (
    <Stack gap={10}>
      <Box as="section" hidden={!data || data?.chamadasAbertas.length === 0}>
        <Flex gap={4} align="center" mb={4}>
          <Box bg="green.solid" color="white" p={2} borderRadius="full">
            <RiPencilLine size={24} />
          </Box>

          <Box flex={1}>
            <Heading lineHeight="shorter" fontWeight="bold">
              Chamadas Abertas
            </Heading>
            <Text color="fg.muted" fontSize="xs">
              Chamadas que você pode se inscrever
            </Text>
          </Box>

          <Badge colorPalette="green">
            {data?.chamadasAbertas.length} <Span hideBelow="sm">disponíveis</Span>
          </Badge>
        </Flex>

        <SimpleGrid gap={4} columns={{ base: 1, md: 2, lg: 3 }}>
          {data?.chamadasAbertas.map(({ chamada, inscricao }) => (
            <Chamada
              key={chamada.id}
              chamada={chamada}
              inscricao={inscricao}
              refeicoesRestritas={data.refeicoesRestritas}
            />
          ))}
        </SimpleGrid>
      </Box>

      <Box as="section" hidden={!data || data?.chamadasFechadas.length === 0}>
        <Flex gap={4} align="center" mb={4}>
          <Box bg="red.solid" color="white" p={2} borderRadius="full">
            <RiLockLine size={24} />
          </Box>

          <Box flex={1}>
            <Heading lineHeight="shorter" fontWeight="bold">
              Chamadas Fechadas
            </Heading>
            <Text color="fg.muted" fontSize="xs">
              Pode cancelar sua inscrição antes de finalizar a chamada
            </Text>
          </Box>

          <Badge colorPalette="red">
            {data?.chamadasFechadas.length} <Span hideBelow="sm">chamadas</Span>
          </Badge>
        </Flex>

        <SimpleGrid gap={4} columns={{ base: 1, md: 2, lg: 3 }}>
          {data?.chamadasFechadas.map(({ chamada, inscricao }) => (
            <Chamada
              key={chamada.id}
              chamada={chamada}
              inscricao={inscricao}
              refeicoesRestritas={data.refeicoesRestritas}
            />
          ))}
        </SimpleGrid>
      </Box>

      <Box as="section" hidden={!data || data?.chamadasAnteriores.length === 0}>
        <Flex gap={4} align="center" mb={4}>
          <Box bg="gray.solid" color="white" p={2} borderRadius="full">
            <RiTimeLine size={24} />
          </Box>

          <Box flex={1}>
            <Heading lineHeight="shorter" fontWeight="bold">
              Chamadas Anteriores
            </Heading>
            <Text color="fg.muted" fontSize="xs">
              Veja os resultados das chamadas
            </Text>
          </Box>

          <Badge colorPalette="gray" hideBelow="sm">
            Finalizadas
          </Badge>
        </Flex>

        <SimpleGrid gap={4} columns={{ base: 1, md: 2, lg: 3 }}>
          {data?.chamadasAnteriores.map(({ chamada, inscricao }) => (
            <Chamada
              key={chamada.id}
              chamada={chamada}
              inscricao={inscricao}
              refeicoesRestritas={data.refeicoesRestritas}
            />
          ))}
        </SimpleGrid>
      </Box>

      <Center>
        <Button variant="ghost">
          Ver todas as chamadas <RiArrowRightLine />
        </Button>
      </Center>
    </Stack>
  )
}
