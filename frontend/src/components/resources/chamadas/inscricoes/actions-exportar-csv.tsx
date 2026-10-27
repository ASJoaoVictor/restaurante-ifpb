import { ChamadaComInscricoes } from '@/api/endpoints/api.schemas'
import { api } from '@/api'
import { Button, Link } from '@chakra-ui/react'
import { RiFileExcel2Line } from 'react-icons/ri'

export function ChamadaExportarCsvAction({ chamada }: { chamada: ChamadaComInscricoes }) {
  return (
    <Button asChild variant="subtle" colorPalette="green">
      <Link
        href={api.getUri({ url: `/api/chamadas/${encodeURIComponent(chamada.chamada.id)}/inscricoes/csv` })}
        rel="noopener noreferrer"
        target="_blank"
        unstyled
      >
        <RiFileExcel2Line />
        Exportar CSV
      </Link>
    </Button>
  )
}
