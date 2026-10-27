import { ChamadaAluno } from '@/api/endpoints/api.schemas'
import { getChamadasDashboardQueryKey } from '@/api/endpoints/chamadas'
import { useInscricoesCancelar } from '@/api/endpoints/inscricoes'
import { Button, Text } from '@chakra-ui/react'
import { useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { RiCloseLine } from 'react-icons/ri'
import { toastError } from '../../error/toast-error'
import {
  DialogActionTrigger,
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { toaster } from '@/components/ui/toaster'

export function CancelarInscricao({ chamada }: { chamada: ChamadaAluno }) {
  const [open, setOpen] = useState(false)
  const queryClient = useQueryClient()

  const { mutateAsync, isPending } = useInscricoesCancelar({
    mutation: {
      onSuccess() {
        handleCancelamentoSuccess()
        setOpen(false)
        void queryClient.invalidateQueries({ queryKey: getChamadasDashboardQueryKey() })
      },
      onError: handleCancelamentoError
    }
  })

  const handleCancel = async () => {
    await mutateAsync({ id: chamada.id })
  }

  return (
    <DialogRoot lazyMount open={open} onOpenChange={(e) => setOpen(e.open)} role="alertdialog">
      <DialogTrigger asChild>
        <Button variant="subtle" colorPalette="red" flex={2}>
          <RiCloseLine />
          Cancelar inscrição
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Cancelar {chamada.nome}?</DialogTitle>
        </DialogHeader>

        <DialogBody>
          <Text>
            Tem certeza que deseja cancelar sua inscrição em {chamada.nome}? Você não poderá se inscrever novamente.
          </Text>
        </DialogBody>

        <DialogFooter>
          <DialogActionTrigger asChild>
            <Button variant="outline">Não</Button>
          </DialogActionTrigger>

          <Button colorPalette="red" onClick={handleCancel} loading={isPending} loadingText="Cancelando...">
            Sim, cancelar
          </Button>
        </DialogFooter>

        <DialogCloseTrigger />
      </DialogContent>
    </DialogRoot>
  )
}

function handleCancelamentoSuccess() {
  toaster.success({
    title: 'Inscrição cancelada com sucesso!',
    description: 'Sua inscrição foi cancelada.'
  })
}

function handleCancelamentoError(error: unknown) {
  toastError(error, {
    title: 'Erro ao cancelar inscrição',
    duration: Infinity
  })
}
