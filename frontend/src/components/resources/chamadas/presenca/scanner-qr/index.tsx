import { ChamadaPresencaDto } from '@/api/endpoints/api.schemas'
import { DialogContent, DialogRoot, DialogTrigger } from '@/components/ui/dialog'
import { Tooltip } from '@/components/ui/tooltip'
import { useBackButtonClosableModal } from '@/hooks/use-back-button-closable-modal'
import { IconButton } from '@chakra-ui/react'
import { RiQrCodeLine } from 'react-icons/ri'
import { TelaScanner } from './tela-scanner'

interface DialogScannerQRProps {
  chamada: ChamadaPresencaDto
}

export function DialogScannerQR({ chamada }: DialogScannerQRProps) {
  const { open, onOpenChange } = useBackButtonClosableModal('scannerQRCode')

  return (
    <DialogRoot size="full" lazyMount open={open} onOpenChange={onOpenChange}>
      <Tooltip content="Ler QR Code" positioning={{ placement: 'left' }}>
        <DialogTrigger asChild>
          <IconButton
            position="fixed"
            bottom={4}
            right={4}
            size="2xl"
            colorPalette="blue"
            rounded="full"
            shadow="lg"
            zIndex={1}
            onClick={() => document.documentElement.requestFullscreen()}
          >
            <RiQrCodeLine />
          </IconButton>
        </DialogTrigger>
      </Tooltip>
      <DialogContent>
        <TelaScanner chamada={chamada} />
      </DialogContent>
    </DialogRoot>
  )
}
