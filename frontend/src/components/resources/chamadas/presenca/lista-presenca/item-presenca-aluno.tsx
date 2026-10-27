import { InscricaoComAluno, InscricaoPresenca } from '@/api/endpoints/api.schemas'
import { UsuarioFoto } from '@/components/resources/usuarios/foto'
import { HoverCardArrow, HoverCardContent, HoverCardRoot, HoverCardTrigger } from '@/components/ui/hover-card'
import { formatTurma } from '@/utils/formatters'
import { Badge, Box, Flex, Heading, Span, Text } from '@chakra-ui/react'
import { AlunoDetalhes } from '../../../alunos/detalhes'
import { ControlesPresenca } from './controles-presenca'
import { usePresenca } from './use-presenca'
import dayjs from 'dayjs'
import { isSuspenso } from '@/utils/aluno'

interface ItemPresencaAlunoProps {
  inscricaoComAluno: InscricaoComAluno
  chamadaId: string
}

export function ItemPresencaAluno({ inscricaoComAluno, chamadaId }: ItemPresencaAlunoProps) {
  const { aluno, usuario, turma, curso, inscricao } = inscricaoComAluno
  const { handleAlternarPresenca, isLoading } = usePresenca(inscricao.id, chamadaId)

  const onAlternarPresenca = (statusAlvo: InscricaoPresenca) => {
    void handleAlternarPresenca(inscricao.presenca, statusAlvo)
  }

  return (
    <Flex gap={4}>
      <UsuarioFoto usuario={usuario} size="md" />

      <Box flex={1}>
        <Span>
          <HoverCardRoot positioning={{ placement: 'right' }}>
            <HoverCardTrigger asChild>
              <Heading
                textStyle="md"
                lineHeight="short"
                w="fit-content"
                cursor="help"
                display="inline-flex"
                gap={2}
                alignItems="flex-start"
                flexWrap="wrap"
              >
                {usuario.name}
                <Badge colorPalette="red" hidden={!aluno.faltas}>
                  {aluno.faltas} faltas
                </Badge>
                <Badge colorPalette="red" hidden={!isSuspenso(aluno)}>
                  Suspenso até {dayjs(aluno.suspensoAte).format('DD [de] MMM')}
                </Badge>
              </Heading>
            </HoverCardTrigger>

            <HoverCardContent p={4}>
              <HoverCardArrow />
              <AlunoDetalhes alunoId={aluno.id} />
            </HoverCardContent>
          </HoverCardRoot>

          {turma && curso && (
            <Text textStyle="sm" lineHeight="short" color="fg.muted">
              {formatTurma(turma, curso)}
            </Text>
          )}
        </Span>
      </Box>

      <ControlesPresenca presenca={inscricao.presenca} onAlternarPresenca={onAlternarPresenca} isLoading={isLoading} />
    </Flex>
  )
}
