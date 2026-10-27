import { OrvalPaginatedGetQueryKey, OrvalRemoveQuery } from '@/types/api'
import { Button } from '@chakra-ui/react'
import { useQueryClient } from '@tanstack/react-query'
import { toastError } from '../../error/toast-error'
import {
  DialogActionTrigger,
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  DialogTitle
} from '../../ui/dialog'
import { toaster } from '../../ui/toaster'

export interface RemoveModalProps<TData extends { id: string }> {
  data: TData | TData[]
  removeHook: OrvalRemoveQuery<TData>
  getQueryKey: OrvalPaginatedGetQueryKey
  closeModal: () => void
}

export function RemoveModal<TData extends { id: string }>({
  data,
  removeHook: useRemoveHook,
  getQueryKey,
  closeModal
}: RemoveModalProps<TData>) {
  const isMultiple = Array.isArray(data) && data.length > 1
  const queryClient = useQueryClient()

  const { mutateAsync, isPending } = useRemoveHook({
    mutation: {
      onSuccess: async () => {
        if (Array.isArray(data)) return
        await handleSuccess()
      },
      onError: (error) => toastError(error)
    }
  })

  const handleSuccess = async () => {
    await queryClient.invalidateQueries({ queryKey: getQueryKey() })
    toaster.success({ title: isMultiple ? 'Itens excluídos com sucesso' : 'Item excluído com sucesso' })
    closeModal()
  }

  const handleRemove = async () => {
    if (Array.isArray(data)) {
      await Promise.all(data.map((item) => mutateAsync({ id: item.id })))
      await handleSuccess()
    } else {
      await mutateAsync({ id: data.id })
    }
  }

  return (
    <DialogRoot open onOpenChange={(details) => !details.open && closeModal()}>
      <DialogContent>
        <DialogCloseTrigger />
        <DialogHeader>
          {isMultiple ? (
            <DialogTitle>Excluir {data.length} itens</DialogTitle>
          ) : (
            <DialogTitle>Excluir item</DialogTitle>
          )}
        </DialogHeader>
        {isMultiple ? (
          <DialogBody>Tem certeza que deseja excluir estes itens?</DialogBody>
        ) : (
          <DialogBody>Tem certeza que deseja excluir este item?</DialogBody>
        )}
        <DialogFooter>
          <DialogActionTrigger asChild>
            <Button variant="outline" disabled={isPending}>
              Não
            </Button>
          </DialogActionTrigger>
          <Button onClick={handleRemove} loading={isPending} loadingText="Excluindo..." colorPalette="red">
            Sim
          </Button>
        </DialogFooter>
      </DialogContent>
    </DialogRoot>
  )
}
