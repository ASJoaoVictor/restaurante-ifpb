import { getAlunosGetAllQueryKey, useAlunosGetAll } from '@/api/endpoints/alunos'
import { Aluno, AlunosGetAllOrderBy, ChamadaComInscricoes } from '@/api/endpoints/api.schemas'
import {
  getChamadasGetOneWithInscricoesQueryKey,
  getChamadasGetPresencaQueryKey,
  useChamadasInserirInscricoesManuais
} from '@/api/endpoints/chamadas'
import { columnsAlunosSelecionar } from '@/components/columns/alunos-selecionar.columns'
import { DataSelectionTable } from '@/components/data-table/selection-table'
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
import { useAuth } from '@/contexts/auth'
import { Box, Button, ButtonProps, Span } from '@chakra-ui/react'
import { useQueryClient } from '@tanstack/react-query'
import { RowSelectionState } from '@tanstack/react-table'
import { useState } from 'react'
import { RiAddLine } from 'react-icons/ri'

export function AdicionarInscricao({ chamada, ...props }: { chamada: ChamadaComInscricoes } & ButtonProps) {
  const [open, setOpen] = useState(false)

  return (
    <DialogRoot size="xl" scrollBehavior="inside" lazyMount open={open} onOpenChange={(e) => setOpen(e.open)}>
      <DialogTrigger asChild>
        <Button w="fit-content" variant="outline" {...props}>
          <RiAddLine />
          <Span hideBelow="sm">Adicionar inscrição</Span>
          <Span hideFrom="sm">Inscrição</Span>
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogCloseTrigger />

        <DialogHeader>
          <DialogTitle>Selecione os alunos para adicionar inscrição</DialogTitle>
        </DialogHeader>

        <AdicionarInscricaoContent chamada={chamada} setOpen={setOpen} />
      </DialogContent>
    </DialogRoot>
  )
}

// O content está em um componente separado para resetar o rowSelection quando o diálogo fechar
function AdicionarInscricaoContent({
  chamada,
  setOpen
}: {
  chamada: ChamadaComInscricoes
  setOpen: (open: boolean) => void
}) {
  const { me } = useAuth()
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})
  const disabledRows = chamada.inscricoes.map((i) => i.aluno.id)
  const queryClient = useQueryClient()

  const { mutateAsync, isPending } = useChamadasInserirInscricoesManuais({
    mutation: {
      onSuccess() {
        void queryClient.invalidateQueries({
          queryKey: getChamadasGetOneWithInscricoesQueryKey(chamada.chamada.id)
        })
        void queryClient.invalidateQueries({
          queryKey: getChamadasGetPresencaQueryKey(chamada.chamada.id)
        })
        setOpen(false)
        toaster.success({
          title: 'Inscrições adicionadas com sucesso'
        })
      },
      onError: toastError
    }
  })

  const handleAdicionar = async () => {
    await mutateAsync({
      id: chamada.chamada.id,
      data: { alunoIds: Object.keys(rowSelection) }
    })
  }

  return (
    <>
      <DialogBody>
        <DataSelectionTable<Aluno>
          id="alunos"
          getQueryKey={getAlunosGetAllQueryKey}
          listHook={useAlunosGetAll}
          columns={columnsAlunosSelecionar(me.user?.isGestor || me.user?.isAdmin || false)}
          defaultSorting={{
            id: 'usuario_name' satisfies AlunosGetAllOrderBy,
            desc: false
          }}
          rowSelection={rowSelection}
          setRowSelection={setRowSelection}
          disabledRows={disabledRows}
        />
      </DialogBody>

      <DialogFooter>
        <Box>{Object.keys(rowSelection).length} selecionado(s)</Box>
        <Box flex={1} />
        <DialogActionTrigger asChild>
          <Button variant="outline">Cancelar</Button>
        </DialogActionTrigger>
        <Button
          disabled={Object.keys(rowSelection).length === 0}
          loading={isPending}
          loadingText="Aguarde..."
          colorPalette="green"
          onClick={handleAdicionar}
        >
          Adicionar
        </Button>
      </DialogFooter>
    </>
  )
}
