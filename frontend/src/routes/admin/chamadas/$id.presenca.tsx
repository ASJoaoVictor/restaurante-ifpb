import { useChamadasGetPresenca } from '@/api/endpoints/chamadas'
import { ErrorComponent } from '@/components/error/error-component'
import { Wrapper } from '@/components/layout/wrapper'
import { GerenciadorPresenca } from '@/components/resources/chamadas/presenca'
import { checkRole } from '@/utils/auth-helpers'
import { Skeleton } from '@chakra-ui/react'
import { createFileRoute } from '@tanstack/react-router'
import dayjs from 'dayjs'

export const Route = createFileRoute('/admin/chamadas/$id/presenca')({
  component: RouteComponent,
  head: () => ({ meta: [{ title: 'Controle de presença | IFPB Meals' }] }),
  beforeLoad: ({ context }) => {
    checkRole(context, ['admin', 'gestor', 'colaborador'])
  }
})

function RouteComponent() {
  const { id } = Route.useParams()
  const { data, isLoading, error, refetch } = useChamadasGetPresenca(id)

  let subtitle
  if (data) {
    subtitle = `${data.chamada.nome} - ${dayjs(data.chamada.data).format('DD [de] MMMM')}`
  }

  return (
    <Wrapper title="Controle de presença" subtitle={subtitle}>
      {isLoading && <Skeleton h="sm" />}
      {error && <ErrorComponent error={error} retry={refetch} />}
      {data && <GerenciadorPresenca chamada={data} />}
    </Wrapper>
  )
}
