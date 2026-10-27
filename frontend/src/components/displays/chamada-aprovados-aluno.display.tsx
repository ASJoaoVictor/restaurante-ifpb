import { ChamadaResultadoAlunoDto } from '@/api/endpoints/api.schemas'
import { Badge, Box, Flex } from '@chakra-ui/react'

export function ChamadaAprovadosAlunoDisplay({ aluno }: { aluno: ChamadaResultadoAlunoDto }) {
  return (
    <Flex gap={2}>
      <Box>{aluno.name}</Box>
      <Badge variant="solid" hidden={!aluno.souEu}>
        Você
      </Badge>
    </Flex>
  )
}
