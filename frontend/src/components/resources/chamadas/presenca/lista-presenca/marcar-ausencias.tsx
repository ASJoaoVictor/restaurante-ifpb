import { ChamadaPresencaDto } from '@/api/endpoints/api.schemas'
import { getChamadasGetPresencaQueryKey, useChamadasMarcarAusencias } from '@/api/endpoints/chamadas'
import { toastError } from '@/components/error/toast-error'
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
import { useBlocker } from '@/hooks/use-blocker'
import { Button, Span } from '@chakra-ui/react'
import { useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { RiCloseLine } from 'react-icons/ri'

export function MarcarAusencias({ chamada }: { chamada: ChamadaPresencaDto }) {
  const [open, setOpen] = useState(false)
  const queryClient = useQueryClient()
  const queryKey = getChamadasGetPresencaQueryKey(chamada.chamada.id)

  const { mutateAsync: aprovarPendentes, isPending } = useChamadasMarcarAusencias({
    mutation: {
      async onSuccess(data) {
        await queryClient.invalidateQueries({ queryKey })
        setOpen(false)
        toaster.success({
          title: 'Ausências marcadas',
          description: `${data.alunosAusentes} alunos foram marcados como ausentes`
        })
      },
      onError: toastError
    }
  })

  useBlocker(isPending)

  const handleAprovarPendentes = async () => {
    await aprovarPendentes({ id: chamada.chamada.id })
  }

  return (
    <DialogRoot lazyMount open={open} onOpenChange={(e) => setOpen(e.open)}>
      <DialogTrigger asChild>
        <Button variant="subtle" colorPalette="red" size="sm">
          <RiCloseLine />
          <Span hideFrom="sm">Ausências</Span>
          <Span hideBelow="sm">Marcar ausências</Span>
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Marcar ausência nos alunos pendentes</DialogTitle>
        </DialogHeader>

        <DialogBody>
          Os alunos que foram contemplados na chamada, mas que não estiverem presentes, serão marcados como ausentes.
          Isso não se aplica aos alunos não contemplados e aos alunos em lista de espera.
        </DialogBody>

        <DialogFooter>
          <DialogActionTrigger asChild>
            <Button variant="outline" disabled={isPending}>
              Cancelar
            </Button>
          </DialogActionTrigger>

          <Button
            type="submit"
            colorPalette="red"
            loading={isPending}
            loadingText="Inscrevendo..."
            onClick={handleAprovarPendentes}
          >
            Marcar ausências
          </Button>
        </DialogFooter>

        <DialogCloseTrigger />
      </DialogContent>
    </DialogRoot>
  )
}
