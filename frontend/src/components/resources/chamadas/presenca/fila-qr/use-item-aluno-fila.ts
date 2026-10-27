import { VerificarPresencaResponseDto } from '@/api/endpoints/api.schemas'
import { getChamadasGetPresencaQueryKey } from '@/api/endpoints/chamadas'
import { useInscricoesMarcarPresenca, useInscricoesPresencaForaDaLista } from '@/api/endpoints/inscricoes'
import { toastError } from '@/components/error/toast-error'
import { toasterTop } from '@/components/ui/toaster-top'
import { useBlocker } from '@/hooks/use-blocker'
import { isSuspenso } from '@/utils/aluno'
import { useQueryClient } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { useCallback, useEffect } from 'react'
import useLocalStorageState from 'use-local-storage-state'
import { errorAudio, playSound, successAudio } from '../scanner-qr/sounds'
import { useVerificacaoAluno } from './use-verificacao-aluno'

export function useItemAlunoFila(alunoId: string, chamadaId: string, onRemover: (id: string) => void) {
  const queryClient = useQueryClient()
  const { data, isLoading, error, inscricaoValida, jaPresente, podeMarcarPresenca } = useVerificacaoAluno(
    chamadaId,
    alunoId
  )
  const [presencaAutomatica] = useLocalStorageState('qrcode.presencaAutomatica', { defaultValue: false })

  // Ao marcar presença, atualiza a lista de presença
  const onMutateSuccess = () => {
    playSound(successAudio)
    const queryKey = getChamadasGetPresencaQueryKey(chamadaId)
    void queryClient.invalidateQueries({ queryKey })
    onRemover(alunoId)
  }

  const onMutateError = (error: any) => {
    playSound(errorAudio)
    toastError(error)
  }

  const { mutateAsync: marcarPresenca, isPending: isMarkingPresence } = useInscricoesMarcarPresenca({
    mutation: { onSuccess: onMutateSuccess, onError: onMutateError }
  })

  const { mutateAsync: incluirPresenca, isPending: isIncluding } = useInscricoesPresencaForaDaLista({
    mutation: { onSuccess: onMutateSuccess, onError: onMutateError }
  })

  useBlocker(isMarkingPresence || isIncluding)

  // Marca presença do aluno
  const handlePresente = useCallback(async () => {
    if (!data?.inscricao) return
    await marcarPresenca({ id: data.inscricao.id, data: { presenca: 'presente' } })
  }, [data, marcarPresenca])

  // Adiciona o aluno na lista, caso ele não tenha inscrito
  const handleIncluir = async () => {
    await incluirPresenca({ id: chamadaId, data: { alunoId } })
  }

  // Verifica se houve erro na consulta
  useEffect(() => {
    if (error) {
      if ('vibrate' in navigator) navigator.vibrate(300)
      toastError(error, { title: 'Erro ao verificar presença', toaster: toasterTop })
      onRemover(alunoId)
    }
  }, [alunoId, error, onRemover])

  // Verifica se o aluno já está presente
  useEffect(() => {
    if (jaPresente) {
      if ('vibrate' in navigator) navigator.vibrate(300)
      playSound(errorAudio)
      toasterTop.warning({
        title: 'Aluno já está presente',
        description: `${data?.aluno.usuario.name} já marcou presença nesta chamada.`
      })
      onRemover(alunoId)
    }
  }, [alunoId, data?.aluno.usuario.name, jaPresente, onRemover])

  // Marca presença automaticamente
  useEffect(() => {
    if (presencaAutomatica && podeMarcarPresenca) {
      if ('vibrate' in navigator) navigator.vibrate(200)
      void handlePresente()
      toasterTop.success({
        title: 'Presença marcada automaticamente',
        description: `${data?.aluno.usuario.name} foi marcado como presente.`,
        duration: 2000
      })
    }
  }, [data?.aluno.usuario.name, handlePresente, podeMarcarPresenca, presencaAutomatica])

  return {
    data,
    isLoading,
    inscricaoValida,
    jaPresente,
    isMarkingPresence,
    isIncluding,
    handlePresente,
    handleIncluir
  }
}

export function obterMensagemStatusInscricao({ aluno, inscricao }: VerificarPresencaResponseDto): string {
  if (isSuspenso(aluno)) return `Aluno suspenso até ${dayjs(aluno.suspensoAte).format('DD [de] MMMM')}`

  if (!inscricao) return 'Aluno não inscrito nesta chamada'

  if (!inscricao.valida) {
    if (inscricao.emListaEspera) return 'Aluno em lista de espera'
    if (inscricao.dataHoraCancelamento) return 'O aluno cancelou a inscrição'
    if (inscricao.status === 'rejeitada') return 'Inscrição rejeitada pelo gestor'
    if (inscricao.status === 'pendente') return 'Aluno em lista de espera'
  }

  return ''
}
