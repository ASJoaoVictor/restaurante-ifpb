import { ChamadaPresencaDto } from '@/api/endpoints/api.schemas'
import { Box, Flex, Heading, Stack, StackSeparator } from '@chakra-ui/react'
import { ItemPresencaAluno } from './item-presenca-aluno'
import { MarcarAusencias } from './marcar-ausencias'
import { NenhumaInscricao } from './nenhuma-inscricao'

export function ListaPresenca({ chamada }: { chamada: ChamadaPresencaDto }) {
  return (
    <>
      {chamada.inscricoesAprovadas.length === 0 && chamada.outrasInscricoes.length === 0 && <NenhumaInscricao />}

      <Flex align="center" gap={4} mt={8} mb={6} hidden={chamada.inscricoesAprovadas.length === 0}>
        <Heading flex={1}>Alunos contemplados</Heading>
        <MarcarAusencias chamada={chamada} />
      </Flex>

      <Stack separator={<StackSeparator />} gap={3} hidden={chamada.inscricoesAprovadas.length === 0}>
        {chamada.inscricoesAprovadas.map((inscricao) => (
          <ItemPresencaAluno
            key={inscricao.inscricao.id}
            inscricaoComAluno={inscricao}
            chamadaId={chamada.chamada.id}
          />
        ))}
      </Stack>

      <Box
        opacity={0.5}
        _hover={{ opacity: 1 }}
        _focusWithin={{ opacity: 1 }}
        transition="opacity 0.2s"
        hidden={chamada.outrasInscricoes.length === 0}
      >
        <Heading mt={16} mb={6}>
          Alunos não contemplados
        </Heading>

        <Stack separator={<StackSeparator />} gap={3} color="fg.error">
          {chamada.outrasInscricoes.map((inscricao) => (
            <ItemPresencaAluno
              key={inscricao.inscricao.id}
              inscricaoComAluno={inscricao}
              chamadaId={chamada.chamada.id}
            />
          ))}
        </Stack>
      </Box>
      
      <Box
        opacity={0.5}
        _hover={{ opacity: 1 }}
        _focusWithin={{ opacity: 1 }}
        transition="opacity 0.2s"
        hidden={chamada.listaDeEspera.length === 0}
      >
        <Heading mt={16} mb={6}>
          Alunos em lista de espera
        </Heading>

        <Stack separator={<StackSeparator />} gap={3} color="blue.solid">
          {chamada.listaDeEspera.map((inscricao) => (
            <ItemPresencaAluno
              key={inscricao.inscricao.id}
              inscricaoComAluno={inscricao}
              chamadaId={chamada.chamada.id}
            />
          ))}
        </Stack>
      </Box>
    </>
  )
}
