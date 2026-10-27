import { Chamada, InscricaoComAluno } from '@/api/endpoints/api.schemas'
import { Badge, Box, Flex, Heading, Span } from '@chakra-ui/react'
import { memo } from 'react'
import { RiAddCircleLine, RiWheelchairLine } from 'react-icons/ri'
import { AlunoDetalhesPopover } from '../resources/alunos/detalhes-container'
import { UsuarioFoto } from '../resources/usuarios/foto'
import { Tooltip } from '../ui/tooltip'

export const InscricaoAlunoDisplay = memo(InscricaoAlunoDisplayMemo)

function InscricaoAlunoDisplayMemo({
  inscricaoComAluno,
  chamada
}: {
  inscricaoComAluno: InscricaoComAluno
  chamada: Chamada
}) {
  const { aluno, usuario, turma, curso, inscricao } = inscricaoComAluno
  const invalida = inscricao.status === 'rejeitada' || !!inscricao.dataHoraCancelamento

  return (
    <AlunoDetalhesPopover aluno={{ ...aluno, usuario, turma: turma!, curso: curso! }}>
      <Flex gap={2} align="center" cursor="help">
        <UsuarioFoto usuario={usuario} />

        <Box>
          <Heading textStyle="md" lineHeight="short" w="fit-content" display="flex" gap={2}>
            <Span color={invalida ? 'fg.error' : undefined} textDecoration={invalida ? 'line-through' : undefined}>
              {usuario.name}
            </Span>

            <Tooltip content="Inserido por um gestor" positioning={{ placement: 'top' }}>
              <Badge colorPalette="blue" variant="solid" hidden={!inscricao.inseridoPeloGestor}>
                <RiAddCircleLine />
                Gest.
              </Badge>
            </Tooltip>

            <Tooltip content="Inserido por um colaborador" positioning={{ placement: 'top' }}>
              <Badge colorPalette="blue" variant="solid" hidden={!inscricao.inseridoPeloColaborador}>
                <RiAddCircleLine />
                Colab.
              </Badge>
            </Tooltip>

            <Badge colorPalette="yellow" hidden={!inscricao.suap}>
              SUAP
            </Badge>

            <Tooltip content="Aluno com Necessidades Educacionais Especiais" positioning={{ placement: 'top' }}>
              <Badge colorPalette="blue" hidden={!aluno.possuiNEE}>
                <RiWheelchairLine />
                NEE
              </Badge>
            </Tooltip>

            <Badge
              colorPalette="green"
              hidden={!inscricao.temAulaContraturno || inscricao.comprovanteContraturnoStatus !== 'aceito'}
            >
              Contraturno
            </Badge>

            <Badge colorPalette="purple" hidden={!chamada.priorizarMesmoTurno || chamada.turno !== turma?.turno}>
              Mesmo turno
            </Badge>

            <Badge colorPalette="red" hidden={!aluno.faltas}>
              {aluno.faltas} faltas
            </Badge>

            <Badge colorPalette="red" hidden={!inscricao.dataHoraCancelamento}>
              Cancelado
            </Badge>
          </Heading>

          <Box textStyle="xs" color="fg.muted">
            <Span fontWeight="medium" fontStyle="italic">
              {aluno.observacoes ? aluno.observacoes + ' • ' : ''}
            </Span>
            {aluno.cidade} - {aluno.estado}
          </Box>
        </Box>
      </Flex>
    </AlunoDetalhesPopover>
  )
}
