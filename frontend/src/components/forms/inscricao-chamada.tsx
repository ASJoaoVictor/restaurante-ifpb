import { ChamadaAluno, CreateInscricaoDto } from '@/api/endpoints/api.schemas'
import { getChamadasDashboardQueryKey } from '@/api/endpoints/chamadas'
import { useInscricoesCreateInscricao } from '@/api/endpoints/inscricoes'
import { useBlocker } from '@/hooks/use-blocker'
import { Button, Stack } from '@chakra-ui/react'
import { useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form'
import { toastError } from '../error/toast-error'
import { ContraturnoField } from '../fields/contraturno.field'
import { InscricaoComprovanteField } from '../fields/inscricao-comprovante.field'
import {
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  DialogTitle,
  DialogTrigger
} from '../ui/dialog'
import { toaster } from '../ui/toaster'

export function InscricaoChamada({ chamada, disabled }: { chamada: ChamadaAluno; disabled?: boolean }) {
  const [open, setOpen] = useState(false)
  const queryClient = useQueryClient()

  const form = useForm<CreateInscricaoDto>({ reValidateMode: 'onChange' })

  const { handleSubmit, formState } = form
  const { dirtyFields, isSubmitted, isSubmitting } = formState
  const isDirty = Object.keys(dirtyFields).length > 0

  useBlocker((isDirty && !isSubmitted) || isSubmitting)

  const { mutateAsync: createInscricao } = useInscricoesCreateInscricao({
    mutation: {
      onSuccess() {
        handleInscricaoSuccess()
        setOpen(false)
        void queryClient.invalidateQueries({ queryKey: getChamadasDashboardQueryKey() })
      },
      onError: handleInscricaoError
    }
  })

  const onSubmit: SubmitHandler<CreateInscricaoDto> = async (data) => {
    await createInscricao({ id: chamada.id, data })
  }

  return (
    <FormProvider {...form}>
      <DialogRoot lazyMount open={open} onOpenChange={(e) => setOpen(e.open)}>
        <DialogTrigger asChild>
          <Button variant="solid" colorPalette="blue" flex={1} disabled={disabled}>
            Inscrever
          </Button>
        </DialogTrigger>

        <DialogContent>
          <form noValidate onSubmit={handleSubmit(onSubmit)}>
            <DialogHeader>
              <DialogTitle>Inscrever em {chamada.nome}</DialogTitle>
            </DialogHeader>

            <DialogBody asChild>
              <Stack gap={4}>
                <ContraturnoField chamada={chamada} />
                <InscricaoComprovanteField chamada={chamada} />
              </Stack>
            </DialogBody>

            <DialogFooter>
              <Button type="submit" loading={form.formState.isSubmitting} loadingText="Inscrevendo...">
                Confirmar refeição
              </Button>
            </DialogFooter>

            <DialogCloseTrigger />
          </form>
        </DialogContent>
      </DialogRoot>
    </FormProvider>
  )
}

export function handleInscricaoSuccess() {
  toaster.success({
    title: 'Inscrição realizada com sucesso!',
    description: 'Sua inscrição foi enviada e o resultado sairá em breve'
  })
}

function handleInscricaoError(error: unknown) {
  toastError(error, {
    title: 'Erro ao fazer inscrição',
    duration: Infinity
  })
}
