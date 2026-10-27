import { InscricaoComAluno } from '@/api/endpoints/api.schemas'
import { getChamadasGetOneWithInscricoesQueryKey } from '@/api/endpoints/chamadas'
import { useInscricoesRemove, useInscricoesUpdate } from '@/api/endpoints/inscricoes'
import { getError } from '@/components/error/get-error'
import { toaster } from '@/components/ui/toaster'
import { IconButton, Menu, Portal } from '@chakra-ui/react'
import { useQueryClient } from '@tanstack/react-query'
import { memo } from 'react'
import { RiDeleteBinLine, RiIndeterminateCircleLine, RiMore2Line } from 'react-icons/ri'

export const InscricaoAcoesDisplay = memo(InscricaoAcoesDisplayMemo)

function InscricaoAcoesDisplayMemo({ inscricaoComAluno }: { inscricaoComAluno: InscricaoComAluno }) {
  const { inscricao } = inscricaoComAluno
  const queryClient = useQueryClient()
  const queryKey = getChamadasGetOneWithInscricoesQueryKey(inscricao.chamadaId)

  const { mutateAsync: updateInscricao } = useInscricoesUpdate({
    mutation: {
      async onSuccess() {
        await queryClient.invalidateQueries({ queryKey })
      }
    }
  })

  const { mutateAsync: removeInscricao } = useInscricoesRemove({
    mutation: {
      async onSuccess() {
        await queryClient.invalidateQueries({ queryKey })
      }
    }
  })

  const handleMarcarCancelado = () => {
    toaster.promise(
      updateInscricao({
        id: inscricao.id,
        data: { dataHoraCancelamento: new Date().toISOString() }
      }),
      {
        success: {
          title: 'Inscrição cancelada',
          description: 'A inscrição foi marcada como cancelada com sucesso.'
        },
        error(error: any) {
          return {
            title: 'Erro ao cancelar inscrição',
            description: getError(error).description
          }
        },
        loading: {
          title: 'Cancelando inscrição...',
          description: 'Aguarde enquanto cancelamos a inscrição.'
        }
      }
    )
  }

  const handleRemoverCancelamento = () => {
    toaster.promise(
      updateInscricao({
        id: inscricao.id,
        data: { dataHoraCancelamento: null }
      }),
      {
        success: {
          title: 'Cancelamento removido',
          description: 'O cancelamento da inscrição foi removido com sucesso.'
        },
        error(error: any) {
          return {
            title: 'Erro ao remover cancelamento',
            description: getError(error).description
          }
        },
        loading: {
          title: 'Removendo cancelamento...',
          description: 'Aguarde enquanto removemos o cancelamento da inscrição.'
        }
      }
    )
  }

  const handleExcluirInscricao = () => {
    toaster.promise(removeInscricao({ id: inscricao.id }), {
      success: {
        title: 'Inscrição excluída',
        description: 'A inscrição foi excluída com sucesso.'
      },
      error(error: any) {
        return {
          title: 'Erro ao excluir inscrição',
          description: getError(error).description
        }
      },
      loading: {
        title: 'Excluindo inscrição...',
        description: 'Aguarde enquanto excluímos a inscrição.'
      }
    })
  }

  return (
    <Menu.Root lazyMount>
      <Menu.Trigger asChild>
        <IconButton aria-label="Ações" rounded="full" variant="ghost" data-interactive>
          <RiMore2Line />
        </IconButton>
      </Menu.Trigger>
      <Portal>
        <Menu.Positioner>
          <Menu.Content>
            {inscricao.dataHoraCancelamento ? (
              <Menu.Item value="cancelado" onClick={handleRemoverCancelamento}>
                <RiIndeterminateCircleLine />
                Remover cancelamento
              </Menu.Item>
            ) : (
              <Menu.Item value="cancelado" color="fg.error" onClick={handleMarcarCancelado}>
                <RiIndeterminateCircleLine />
                Marcar como cancelado
              </Menu.Item>
            )}

            <Menu.Item value="excluir" color="fg.error" onClick={handleExcluirInscricao}>
              <RiDeleteBinLine />
              Excluir inscrição
            </Menu.Item>
          </Menu.Content>
        </Menu.Positioner>
      </Portal>
    </Menu.Root>
  )
}
