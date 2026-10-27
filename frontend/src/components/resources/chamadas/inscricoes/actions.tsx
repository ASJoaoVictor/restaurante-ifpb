import { ChamadaComInscricoes } from '@/api/endpoints/api.schemas'
import { Box, Button, HStack } from '@chakra-ui/react'
import { Link } from '@tanstack/react-router'
import { RiPencilLine, RiUserLine } from 'react-icons/ri'
import { AprovarPendentesActions } from './actions-aprovar-pendentes'
import { ChamadaExportarCsvAction } from './actions-exportar-csv'
import { ChamadaImportarActions } from './actions-importar'
import { ChamadaImprimirActions } from './actions-imprimir'
import { ChamadaStatusActions } from './actions-status'

export function ChamadaActions({ chamada }: { chamada: ChamadaComInscricoes }) {
  return (
    <HStack gap={2} wrap={{ base: 'wrap', lg: 'nowrap' }}>
      <Button asChild variant="subtle" colorPalette="blue">
        <Link to="/admin/chamadas/editar/$id" params={{ id: chamada.chamada.id }}>
          <RiPencilLine />
          Editar
        </Link>
      </Button>

      <AprovarPendentesActions chamada={chamada} />

      <ChamadaImportarActions chamada={chamada} />

      <Button asChild variant="subtle" colorPalette="cyan">
        <Link to="/admin/chamadas/$id/presenca" params={{ id: chamada.chamada.id }}>
          <RiUserLine />
          Presença
        </Link>
      </Button>

      <Box flex={{ lg: 1 }} />

      <ChamadaExportarCsvAction chamada={chamada} />

      <ChamadaImprimirActions chamada={chamada} />

      <ChamadaStatusActions chamada={chamada} />
    </HStack>
  )
}
