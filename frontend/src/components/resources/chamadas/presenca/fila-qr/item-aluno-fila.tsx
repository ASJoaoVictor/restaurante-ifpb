import { ChamadaPresencaDto } from '@/api/endpoints/api.schemas'
import { UsuarioFoto } from '@/components/resources/usuarios/foto'
import { formatTurma } from '@/utils/formatters'
import { Box, Flex, Heading, IconButton, Text } from '@chakra-ui/react'
import { RiCloseLine } from 'react-icons/ri'
import { AcoesFila } from './acoes-fila'
import { ItemAlunoFilaSkeleton } from './Item-aluno-fila-skeleton'
import { obterMensagemStatusInscricao, useItemAlunoFila } from './use-item-aluno-fila'

interface ItemAlunoFilaProps {
  alunoId: string
  onRemover: (id: string) => void
  chamada: ChamadaPresencaDto
}

export function ItemAlunoFila({ alunoId, onRemover, chamada }: ItemAlunoFilaProps) {
  const {
    data,
    isLoading,
    inscricaoValida,
    jaPresente,
    isMarkingPresence,
    isIncluding,
    handlePresente,
    handleIncluir
  } = useItemAlunoFila(alunoId, chamada.chamada.id, onRemover)

  if (isLoading) {
    return <ItemAlunoFilaSkeleton />
  }

  if (!data) return null

  const mensagemErro = obterMensagemStatusInscricao(data)
  const temInscricao = !!data.inscricao
  const paletaCores = temInscricao ? (inscricaoValida ? 'green' : 'orange') : 'red'

  return (
    <Box colorPalette={paletaCores}>
      <Flex gap={4}>
        <UsuarioFoto usuario={data.aluno.usuario} size="md" />
        <Box flex={1}>
          <IconButton aria-label="Remover da fila" onClick={() => onRemover(alunoId)} float="right" variant="ghost">
            <RiCloseLine style={{ position: 'absolute', top: 0, right: 0 }} />
          </IconButton>

          <Heading textStyle="md" lineHeight="short">
            {data.aluno.usuario.name || 'Aluno inexistente'}
          </Heading>

          {data.aluno.turma && data.aluno.curso && (
            <Text textStyle="sm" lineHeight="short" color="fg.muted">
              {formatTurma(data.aluno.turma, data.aluno.curso)}
            </Text>
          )}

          {data.aluno.observacoes && (
            <Text textStyle="sm" fontStyle="italic" lineHeight="short" color="fg.muted">
              {data.aluno.observacoes}
            </Text>
          )}

          {mensagemErro && (
            <Text color="fg.error" fontWeight="bold">
              {mensagemErro}
            </Text>
          )}
        </Box>
      </Flex>

      <Box textAlign="right" mt={2}>
        <AcoesFila
          temInscricao={temInscricao}
          inscricaoValida={!!inscricaoValida}
          jaPresente={jaPresente}
          isLoading={isMarkingPresence || isIncluding}
          onMarcarPresente={handlePresente}
          onIncluirAluno={handleIncluir}
        />
      </Box>
    </Box>
  )
}
