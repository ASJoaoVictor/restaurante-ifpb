import { useAuth } from '@/contexts/auth'
import { isSuspenso } from '@/utils/aluno'
import { Box } from '@chakra-ui/react'
import dayjs from 'dayjs'
import { Alert } from '../../ui/alert'

export function AlunoFaltas() {
  const { me } = useAuth()
  const { aluno, campus } = me

  if (!aluno || !campus) return null

  const isProximoDeSuspensao = aluno.faltas >= 1 && campus.maximoDeFaltas - aluno.faltas === 1

  if (isProximoDeSuspensao) {
    return (
      <Alert status="warning" title="Você está próximo de atingir o limite de faltas" mb={6}>
        <Box>
          Informamos que você já possui{' '}
          <b>
            {aluno.faltas} de {campus.maximoDeFaltas}
          </b>{' '}
          faltas permitidas. Caso receba mais uma falta, ficará suspenso por <b>{campus.diasDeSuspensao} dias</b>, não podendo solicitar
          refeições nesse período.
        </Box>
        <Box>Se acreditar que houve algum engano, entre em contato com a administração do campus.</Box>
      </Alert>
    )
  }

  if (isSuspenso(aluno)) {
    return (
      <Alert status="error" title="Você atingiu o limite de faltas e está suspenso" mb={6}>
        <Box>
          Informamos que você alcançou o limite máximo de faltas permitido (<b>{campus.maximoDeFaltas} faltas</b>).
        </Box>
        <Box>
          Dessa forma, você ficará suspenso até <b>{dayjs(aluno.suspensoAte).format('DD [de] MMMM')}</b>, não podendo
          solicitar refeições nesse período.
        </Box>
        <Box>Caso acredite que houve algum engano, entre em contato com a administração do campus.</Box>
      </Alert>
    )
  }

  return null
}
