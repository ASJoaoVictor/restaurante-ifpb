import { ChamadaComInscricoes, Inscricao } from '@/api/endpoints/api.schemas'
import { getChamadasGetOneWithInscricoesQueryKey } from '@/api/endpoints/chamadas'
import { useInscricoesUpdate } from '@/api/endpoints/inscricoes'
import { toastError } from '@/components/error/toast-error'
import { useBlocker } from '@/hooks/use-blocker'
import { ButtonGroup, IconButton } from '@chakra-ui/react'
import { useQueryClient } from '@tanstack/react-query'
import { memo } from 'react'
import { RiCheckLine, RiCloseLine } from 'react-icons/ri'

export const InscricaoStatusDisplay = memo(InscricaoStatusDisplayMemo)

function InscricaoStatusDisplayMemo({ inscricao }: { inscricao: Inscricao }) {
  const queryClient = useQueryClient()

  const { mutate: updateInscricao, isPending } = useInscricoesUpdate({
    mutation: { onSuccess: (data) => onSuccess(data), onError: toastError }
  })

  useBlocker(isPending)

  const onSuccess = async (data: Inscricao) => {
    const queryKey = getChamadasGetOneWithInscricoesQueryKey(inscricao.chamadaId)

    await queryClient.setQueryData(queryKey, (oldData: ChamadaComInscricoes): ChamadaComInscricoes => {
      const insc = oldData.inscricoes.find((insc) => insc.inscricao.id === inscricao.id)
      if (insc) insc.inscricao.status = data.status
      return oldData
    })

    void queryClient.invalidateQueries({ queryKey })
  }

  const disabled = isPending || !!inscricao.dataHoraCancelamento

  return (
    <ButtonGroup
      size="sm"
      attached
      colorPalette={inscricao.status === 'aceita' ? 'green' : inscricao.status === 'rejeitada' ? 'red' : undefined}
    >
      <IconButton
        variant={inscricao.status === 'aceita' ? 'solid' : 'outline'}
        onClick={() =>
          updateInscricao({
            id: inscricao.id,
            data: { status: inscricao.status === 'aceita' ? 'pendente' : 'aceita' }
          })
        }
        disabled={disabled}
      >
        <RiCheckLine />
      </IconButton>
      <IconButton
        variant={inscricao.status === 'rejeitada' ? 'solid' : 'outline'}
        onClick={() =>
          updateInscricao({
            id: inscricao.id,
            data: { status: inscricao.status === 'rejeitada' ? 'pendente' : 'rejeitada' }
          })
        }
        disabled={disabled}
      >
        <RiCloseLine />
      </IconButton>
    </ButtonGroup>
  )
}
