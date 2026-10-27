import { InscricaoPresenca } from '@/api/endpoints/api.schemas'
import { getChamadasGetPresencaQueryKey } from '@/api/endpoints/chamadas'
import { useInscricoesMarcarPresenca } from '@/api/endpoints/inscricoes'
import { toastError } from '@/components/error/toast-error'
import { useBlocker } from '@/hooks/use-blocker'
import { useQueryClient } from '@tanstack/react-query'

export function usePresenca(inscricaoId: string, chamadaId: string) {
  const queryClient = useQueryClient()

  const { mutateAsync: marcarPresenca, isPending } = useInscricoesMarcarPresenca({
    mutation: {
      async onSuccess() {
        const queryKey = getChamadasGetPresencaQueryKey(chamadaId)
        await queryClient.invalidateQueries({ queryKey })
      },
      onError: toastError
    }
  })

  useBlocker(isPending)

  const handleAlternarPresenca = async (statusAtual: InscricaoPresenca, statusAlvo: InscricaoPresenca) => {
    const novoStatus = statusAtual === statusAlvo ? 'pendente' : statusAlvo
    await marcarPresenca({
      id: inscricaoId,
      data: { presenca: novoStatus }
    })
  }

  return {
    handleAlternarPresenca,
    isLoading: isPending
  }
}
