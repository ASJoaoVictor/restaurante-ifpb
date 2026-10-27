import { ChamadaPresencaDto } from '@/api/endpoints/api.schemas'
import { Box, Stack } from '@chakra-ui/react'
import { AdicionarInscricao } from '../inscricoes/adicionar-inscricao'
import { ChamadaImprimirPresenca } from '../inscricoes/actions-imprimir'
import { ListaPresenca } from './lista-presenca'
import { ListaPresencaDetails } from './lista-presenca/details'
import { DialogScannerQR } from './scanner-qr'

export function GerenciadorPresenca({ chamada }: { chamada: ChamadaPresencaDto }) {
  return (
    <>
      <Stack direction="row">
        <AdicionarInscricao
          chamada={{
            chamada: chamada.chamada,
            inscricoes: chamada.inscricoesAprovadas
          }}
          variant="solid"
        />
        <ChamadaImprimirPresenca chamadaId={chamada.chamada.id} chamadaNome={chamada.chamada.nome} />
        <Box flex={1} />
        <ListaPresencaDetails chamada={chamada} />
      </Stack>
      <ListaPresenca chamada={chamada} />
      <DialogScannerQR chamada={chamada} />
    </>
  )
}
