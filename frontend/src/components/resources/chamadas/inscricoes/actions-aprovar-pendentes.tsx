import { ChamadaComInscricoes } from '@/api/endpoints/api.schemas'
import { getChamadasGetOneWithInscricoesQueryKey, useChamadasAprovarPendentes } from '@/api/endpoints/chamadas'
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
import { useBlocker } from '@/hooks/use-blocker'
import { Button } from '@chakra-ui/react'
import { useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { RiCheckLine } from 'react-icons/ri'
import { toastError } from '@/components/error/toast-error'
import { toaster } from '@/components/ui/toaster'

export function AprovarPendentesActions({ chamada }: { chamada: ChamadaComInscricoes }) {
  const [open, setOpen] = useState(false)
  const queryClient = useQueryClient()
  const queryKey = getChamadasGetOneWithInscricoesQueryKey(chamada.chamada.id)

  const { mutateAsync: aprovarPendentes, isPending } = useChamadasAprovarPendentes({
    mutation: {
      async onSuccess(data) {
        await queryClient.invalidateQueries({ queryKey })
        setOpen(false)
        toaster.success({
          title: 'Alunos aprovados com sucesso',
          description: `${data.alunosAprovados} alunos foram aprovados`
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
        <Button variant="subtle" colorPalette="green">
          <RiCheckLine />
          Aprovar pendentes
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Aprovar alunos pendentes</DialogTitle>
        </DialogHeader>

        <DialogBody>
          Os alunos em que não tiveram suas inscrições rejeitadas e que não cancelaram a inscrição serão contemplados
          automaticamente, respeitando a ordem de prioridade e o limite de vagas disponíveis. Deseja prosseguir?
        </DialogBody>

        <DialogFooter>
          <DialogActionTrigger asChild>
            <Button variant="outline" disabled={isPending}>
              Cancelar
            </Button>
          </DialogActionTrigger>

          <Button type="submit" loading={isPending} loadingText="Inscrevendo..." onClick={handleAprovarPendentes}>
            Aprovar pendentes
          </Button>
        </DialogFooter>

        <DialogCloseTrigger />
      </DialogContent>
    </DialogRoot>
  )
}
