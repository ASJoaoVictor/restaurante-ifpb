import { Button } from '@chakra-ui/react'
import { RiAddLine, RiCheckLine } from 'react-icons/ri'

interface AcoesFilaProps {
  temInscricao: boolean
  inscricaoValida: boolean
  jaPresente: boolean
  isLoading: boolean
  onMarcarPresente: () => void
  onIncluirAluno: () => void
}

export function AcoesFila({
  temInscricao,
  inscricaoValida,
  jaPresente,
  isLoading,
  onMarcarPresente,
  onIncluirAluno
}: AcoesFilaProps) {
  if (temInscricao) {
    return (
      <Button onClick={onMarcarPresente} loading={isLoading} disabled={jaPresente}>
        <RiCheckLine />
        {inscricaoValida ? 'Presente' : 'Marcar presença mesmo assim'}
      </Button>
    )
  }

  return (
    <Button onClick={onIncluirAluno} loading={isLoading}>
      <RiAddLine />
      Incluir aluno
    </Button>
  )
}
