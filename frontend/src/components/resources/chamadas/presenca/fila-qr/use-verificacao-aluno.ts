import { getInscricoesVerificarPresencaQueryKey, useInscricoesVerificarPresenca } from '@/api/endpoints/inscricoes'

export function useVerificacaoAluno(chamadaId: string, alunoId: string) {
  const { data, isLoading, error } = useInscricoesVerificarPresenca(chamadaId, alunoId, {
    query: {
      queryKey: getInscricoesVerificarPresencaQueryKey(chamadaId, alunoId),
      gcTime: 0
    }
  })

  const inscricaoValida = data?.inscricao?.valida
  const jaPresente = data?.inscricao?.presenca === 'presente'
  const podeMarcarPresenca = data && !error && inscricaoValida && !jaPresente

  return {
    data,
    isLoading,
    error,
    inscricaoValida,
    jaPresente,
    podeMarcarPresenca
  }
}
