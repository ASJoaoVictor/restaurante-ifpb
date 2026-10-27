import { ChamadaPresencaDto } from '@/api/endpoints/api.schemas'
import { getError } from '@/components/error/get-error'
import { toastError } from '@/components/error/toast-error'
import { toasterTop } from '@/components/ui/toaster-top'
import { IDetectedBarcode } from '@/lib/react-qr-scanner'
import { useState } from 'react'
import { analisarQRCodeAluno, checkQRCodeSignature } from './parser-qrcode'
import { errorAudio, loadingAudio, playSound } from './sounds'

export function useScannerQR(chamada: ChamadaPresencaDto, onEscanearAluno: (alunoId: string) => void) {
  const [lanterna, setLanterna] = useState(false)

  const handleEscanearQRCode = async (data: IDetectedBarcode[]) => {
    const [{ rawValue: valor }] = data
    if ('vibrate' in navigator) navigator.vibrate(100)

    try {
      const { alunoId, assinatura } = analisarQRCodeAluno(valor)

      try {
        const assinaturaValida = await checkQRCodeSignature(alunoId, assinatura, chamada.qrCodeSignaturePublicKey)

        if (assinaturaValida) {
          onEscanearAluno(alunoId)
          playSound(loadingAudio)
        } else {
          playSound(errorAudio)
          toasterTop.error({
            title: 'Assinatura inválida',
            description: 'O QR code pode ter sido adulterado',
            closable: true,
            duration: 3000
          })
        }
      } catch (error) {
        playSound(errorAudio)
        toastError(error, {
          title: 'Erro ao verificar assinatura do QR code',
          toaster: toasterTop,
          closable: true,
          duration: 3000
        })
      }
    } catch (error) {
      playSound(errorAudio)
      toastError(error, {
        title: 'QR Code inválido',
        description: 'O QR Code escaneado não é de um aluno',
        closable: true,
        duration: 3000
      })
    }
  }

  const handleError = (err: any) => {
    toasterTop.error({ ...getError(err), duration: 3000, closable: true })
  }

  const alternarLanterna = () => {
    setLanterna(!lanterna)
  }

  return {
    lanterna,
    handleEscanearQRCode,
    handleError,
    alternarLanterna
  }
}
