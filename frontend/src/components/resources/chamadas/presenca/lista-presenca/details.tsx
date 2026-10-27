import { ChamadaPresencaDto } from '@/api/endpoints/api.schemas'
import { ProgressBar, ProgressRoot } from '@/components/ui/progress'
import { Tooltip } from '@/components/ui/tooltip'
import { HStack, Icon, Stack } from '@chakra-ui/react'
import { RiCheckLine, RiCircleLine, RiCloseLine, RiUserUnfollowLine } from 'react-icons/ri'

export function ListaPresencaDetails({ chamada }: { chamada: ChamadaPresencaDto }) {
  const todasInscricoes = [...chamada.inscricoesAprovadas, ...chamada.outrasInscricoes]
  const presentes = todasInscricoes.filter((i) => i.inscricao.presenca === 'presente').length
  const ausentes = todasInscricoes.filter((i) => i.inscricao.presenca === 'ausente').length
  const desistentes = todasInscricoes.filter((i) => i.inscricao.presenca === 'desistente').length
  const pendentes = chamada.inscricoesAprovadas.filter((i) => i.inscricao.presenca === 'pendente').length

  return (
    <Stack w="min-content">
      <HStack gap={4}>
        <Tooltip content="Presentes" positioning={{ placement: 'top' }}>
          <HStack>
            {presentes}
            <Icon color="green.solid">
              <RiCheckLine />
            </Icon>
          </HStack>
        </Tooltip>

        <Tooltip content="Ausentes" positioning={{ placement: 'top' }}>
          <HStack>
            {ausentes}
            <Icon color="red.solid">
              <RiCloseLine />
            </Icon>
          </HStack>
        </Tooltip>

        <Tooltip content="Desistentes" positioning={{ placement: 'top' }}>
          <HStack>
            {desistentes}
            <Icon color="orange.solid">
              <RiUserUnfollowLine />
            </Icon>
          </HStack>
        </Tooltip>

        <Tooltip content="Pendentes" positioning={{ placement: 'top' }}>
          <HStack>
            {pendentes}
            <Icon color="purple.solid">
              <RiCircleLine />
            </Icon>
          </HStack>
        </Tooltip>
      </HStack>

      <ProgressRoot
        size="xs"
        min={0}
        max={chamada.inscricoesAprovadas.length}
        value={chamada.inscricoesAprovadas.length - pendentes}
      >
        <ProgressBar />
      </ProgressRoot>
    </Stack>
  )
}
