import { ChamadaComInscricoes } from '@/api/endpoints/api.schemas'
import {
  getChamadasGetOneWithInscricoesQueryKey,
  useChamadasAbrirChamada,
  useChamadasDesfazerAberturaChamada,
  useChamadasDesfazerFinalizacaoChamada,
  useChamadasDivulgarResultadoChamada,
  useChamadasEncerrarChamada,
  useChamadasFecharChamada,
  useChamadasFinalizarChamada,
  useChamadasReabrirChamada
} from '@/api/endpoints/chamadas'
import { toastError } from '@/components/error/toast-error'
import { toaster } from '@/components/ui/toaster'
import { CHAMADA_ACOES } from '@/enums/chamada'
import { useBlocker } from '@/hooks/use-blocker'
import { Button, ButtonGroup, IconButton, Menu, Portal } from '@chakra-ui/react'
import { useQueryClient } from '@tanstack/react-query'
import { LuChevronDown } from 'react-icons/lu'
import { RiArrowGoBackLine, RiCloseLine, RiDoorOpenLine, RiLockLine } from 'react-icons/ri'

export function ChamadaStatusActions({ chamada }: { chamada: ChamadaComInscricoes }) {
  const queryClient = useQueryClient()
  const queryKey = getChamadasGetOneWithInscricoesQueryKey(chamada.chamada.id)

  const { mutateAsync: abrirChamada, isPending: isAbrirPending } = useChamadasAbrirChamada({
    mutation: {
      async onSuccess() {
        await queryClient.invalidateQueries({ queryKey })
        toaster.success({
          title: 'Chamada aberta com sucesso',
          description: 'Agora os alunos podem se inscrever na chamada',
          duration: 5000
        })
      },
      onError: toastError
    }
  })

  const { mutateAsync: fecharChamada, isPending: isFecharPending } = useChamadasFecharChamada({
    mutation: {
      async onSuccess() {
        await queryClient.invalidateQueries({ queryKey })
        toaster.success({
          title: 'Chamada fechada com sucesso',
          description: 'Os alunos não podem mais se inscrever na chamada, mas ainda podem cancelar a inscrição',
          duration: 5000
        })
      },
      onError: toastError
    }
  })

  const { mutateAsync: divulgarResultadoChamada, isPending: isDivulgarPending } = useChamadasDivulgarResultadoChamada({
    mutation: {
      async onSuccess() {
        await queryClient.invalidateQueries({ queryKey })
        toaster.success({
          title: 'Resultado da chamada divulgado com sucesso',
          description: 'Os alunos podem ver o resultado da chamada',
          duration: 5000
        })
      },
      onError: toastError
    }
  })

  const { mutateAsync: finalizarChamada, isPending: isFinalizarPending } = useChamadasFinalizarChamada({
    mutation: {
      async onSuccess() {
        await queryClient.invalidateQueries({ queryKey })
        toaster.success({
          title: 'Chamada finalizada com sucesso',
          description: 'Os alunos não podem mais cancelar a inscrição',
          duration: 5000
        })
      },
      onError: toastError
    }
  })

  const { mutateAsync: encerrarChamada, isPending: isEncerrarPending } = useChamadasEncerrarChamada({
    mutation: {
      async onSuccess() {
        await queryClient.invalidateQueries({ queryKey })
        toaster.success({
          title: 'Chamada encerrada com sucesso',
          description: 'Os alunos que estavam ausentes na chamada receberam falta',
          duration: 5000
        })
      },
      onError: toastError
    }
  })

  const { mutateAsync: reabrirChamada, isPending: isReabrirPending } = useChamadasReabrirChamada({
    mutation: {
      async onSuccess() {
        await queryClient.invalidateQueries({ queryKey })
        toaster.success({
          title: 'Chamada reaberta com sucesso',
          description: 'Os alunos podem se inscrever novamente na chamada',
          duration: 5000
        })
      },
      onError: toastError
    }
  })

  const { mutateAsync: desfazerFinalizacaoChamada, isPending: isDesfazerFinalizacaoPending } =
    useChamadasDesfazerFinalizacaoChamada({
      mutation: {
        async onSuccess() {
          await queryClient.invalidateQueries({ queryKey })
          toaster.success({
            title: 'A finalização da chamada foi desfeita com sucesso',
            description: 'Os alunos podem cancelar suas inscrições na chamada',
            duration: 5000
          })
        },
        onError: toastError
      }
    })

  const { mutateAsync: desfazerAberturaChamada, isPending: isDesfazerAberturaPending } =
    useChamadasDesfazerAberturaChamada({
      mutation: {
        async onSuccess() {
          await queryClient.invalidateQueries({ queryKey })
          toaster.success({
            title: 'A chamada foi marcada como pendente',
            description: 'Os alunos não podem mais ver a chamada',
            duration: 5000
          })
        },
        onError: toastError
      }
    })

  const handleAbrir = () => abrirChamada({ id: chamada.chamada.id })
  const handleFechar = () => fecharChamada({ id: chamada.chamada.id })
  const handleDivulgar = () => divulgarResultadoChamada({ id: chamada.chamada.id })
  const handleFinalizar = () => finalizarChamada({ id: chamada.chamada.id })
  const handleEncerrar = () => encerrarChamada({ id: chamada.chamada.id })
  const handleReabrir = () => reabrirChamada({ id: chamada.chamada.id })
  const handleDesfazerFinalizacao = () => desfazerFinalizacaoChamada({ id: chamada.chamada.id })
  const handleDesfazerAbertura = () => desfazerAberturaChamada({ id: chamada.chamada.id })

  const [text, Icon, color, handleAction] = CHAMADA_ACOES(
    handleAbrir,
    handleFechar,
    handleDivulgar,
    handleFinalizar,
    handleEncerrar
  )[chamada.chamada.status]

  const isLoading =
    isAbrirPending ||
    isFecharPending ||
    isDivulgarPending ||
    isFinalizarPending ||
    isEncerrarPending ||
    isReabrirPending ||
    isDesfazerFinalizacaoPending ||
    isDesfazerAberturaPending

  useBlocker(isLoading)

  return (
    <ButtonGroup attached colorPalette={color}>
      <Button
        disabled={!handleAction}
        onClick={handleAction || (() => {})}
        loading={isLoading}
        loadingText="Aguarde..."
      >
        <Icon />
        {text}
      </Button>

      <Menu.Root lazyMount>
        <Menu.Trigger asChild>
          <IconButton aria-label="Mais opções" roundedStart={0}>
            <LuChevronDown />
          </IconButton>
        </Menu.Trigger>

        <Portal>
          <Menu.Positioner>
            <Menu.Content>
              <Menu.Item
                value="reabrir"
                disabled={['pendente', 'aberta'].includes(chamada.chamada.status)}
                onSelect={handleReabrir}
              >
                <RiDoorOpenLine />
                Reabrir chamada
              </Menu.Item>

              <Menu.Item
                value="desfazer-abertura"
                disabled={chamada.chamada.dataHoraAberturaReal === null}
                onSelect={handleDesfazerAbertura}
              >
                <RiLockLine />
                Desfazer abertura da chamada
              </Menu.Item>

              <Menu.Item
                value="desfazer-finalizacao"
                disabled={!chamada.chamada.estaFinalizada}
                onSelect={handleDesfazerFinalizacao}
              >
                <RiArrowGoBackLine />
                Desfazer finalização da chamada
              </Menu.Item>

              <Menu.Item
                value="encerrar-chamada"
                disabled={chamada.chamada.estaEncerrada}
                onSelect={handleEncerrar}
              >
                <RiCloseLine />
                Encerrar chamada diretamente
              </Menu.Item>
            </Menu.Content>
          </Menu.Positioner>
        </Portal>
      </Menu.Root>
    </ButtonGroup>
  )
}
