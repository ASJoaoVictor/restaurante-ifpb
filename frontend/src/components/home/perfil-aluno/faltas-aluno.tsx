import { MeDto } from '@/api/endpoints/api.schemas'
import { isSuspenso } from '@/utils/aluno'
import { Box, Heading, Text } from '@chakra-ui/react'

export function FaltasAluno({ auth }: { auth: MeDto }) {
  const faltas = auth.aluno?.faltas ?? 0
  const maxFaltas = auth.campus?.maximoDeFaltas ?? 0

  const faltasRestantes = maxFaltas - faltas

  const COLORS: Record<number, string> = {
    0: 'red.solid',
    1: 'orange.solid',
    2: 'yellow.solid',
    [maxFaltas]: 'green.solid'
  }

  const color = COLORS[faltasRestantes] ?? 'fg'
  if (!auth.aluno?.suspensoAte) return null

  if (!isSuspenso(auth.aluno)) {
    return (
      <Box gap={2}>
        <Heading as="h3" textStyle="sm" fontSize="lg" fontWeight="medium">
          Faltas
        </Heading>
        <Text textStyle="md" color={color}>
          {faltas} / {maxFaltas}
        </Text>
      </Box>
    )
  }
}
