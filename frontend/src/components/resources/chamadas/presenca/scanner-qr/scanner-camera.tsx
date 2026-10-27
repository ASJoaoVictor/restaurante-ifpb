import { ChamadaPresencaDto } from '@/api/endpoints/api.schemas'
import { Scanner } from '@/lib/react-qr-scanner'
import { ControlesScanner } from './controles-scanner'
import { useScannerQR } from './use-scanner-qr'

interface ScannerCameraProps {
  chamada: ChamadaPresencaDto
  onEscanearAluno: (alunoId: string) => void
}

export function ScannerCamera({ chamada, onEscanearAluno }: ScannerCameraProps) {
  const {
    lanterna,
    handleEscanearQRCode,
    handleError: handleErro,
    alternarLanterna
  } = useScannerQR(chamada, onEscanearAluno)

  return (
    <>
      <Scanner
        torch={lanterna}
        onScan={handleEscanearQRCode}
        sound={false}
        components={{ torch: false }}
        onError={handleErro}
      />

      <ControlesScanner lanterna={lanterna} onAlternarLanterna={alternarLanterna} />
    </>
  )
}
