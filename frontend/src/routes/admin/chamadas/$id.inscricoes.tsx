import { getChamadasGetOneWithInscricoesQueryKey, useChamadasGetOneWithInscricoes } from '@/api/endpoints/chamadas'
import { ErrorComponent } from '@/components/error/error-component'
import { Wrapper } from '@/components/layout/wrapper'
import { Chamada } from '@/components/resources/chamadas/inscricoes/chamada'
import { InscricoesSkeleton } from '@/components/resources/chamadas/inscricoes/skeleton'
import { CHAMADA_STATUS_COLOR, CHAMADA_STATUS_NOME } from '@/enums/chamada'
import { checkRole } from '@/utils/auth-helpers'
import { Badge, Wrap } from '@chakra-ui/react'
import { createFileRoute } from '@tanstack/react-router'
import dayjs from 'dayjs'

export const Route = createFileRoute('/admin/chamadas/$id/inscricoes')({
  component: RouteComponent,
  head: () => ({ meta: [{ title: 'Inscrições da chamada | IFPB Meals' }] }),
  beforeLoad: ({ context }) => {
    checkRole(context, ['admin', 'gestor'])
  }
})

function RouteComponent() {
  const { id } = Route.useParams()
  const { data, isLoading, error, refetch } = useChamadasGetOneWithInscricoes(id, {
    query: {
      queryKey: getChamadasGetOneWithInscricoesQueryKey(id),
      refetchInterval: 5000
    }
  })

  const subtitle = []
  if (data) {
    subtitle.push(`${data.chamada.nome} - ${dayjs(data.chamada.data).format('DD [de] MMMM')}`)
    subtitle.push(
      <Badge colorPalette={CHAMADA_STATUS_COLOR[data.chamada.status]} variant="solid" size="lg" key="status">
        {CHAMADA_STATUS_NOME[data.chamada.status]}
      </Badge>
    )
  }

  return (
    <Wrapper title="Inscrições da chamada" subtitle={<Wrap>{subtitle}</Wrap>}>
      {isLoading && <InscricoesSkeleton />}
      {error && <ErrorComponent error={error} retry={refetch} />}
      {data && <Chamada chamada={data} />}
    </Wrapper>
  )
}
