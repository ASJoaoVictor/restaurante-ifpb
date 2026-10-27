import { Chamada, ImportarInscricoesDto, ImportarInscricoesResponseDto } from '@/api/endpoints/api.schemas'
import { getChamadasGetOneWithInscricoesQueryKey, useChamadasImportarInscricoesSuap } from '@/api/endpoints/chamadas'
import { useBlocker } from '@/hooks/use-blocker'
import { Box, Button, Collapsible, Heading, Table, Text } from '@chakra-ui/react'
import { useQueryClient } from '@tanstack/react-query'
import { PropsWithChildren, useState } from 'react'
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form'
import { RiArrowDropDownLine } from 'react-icons/ri'
import { toastError } from '../error/toast-error'
import { FileField } from '../fields/common/file.field'
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

export function ImportarInscricoesSuapForm({ chamada, children }: { chamada: Chamada } & PropsWithChildren) {
  const [open, setOpen] = useState(false)
  const queryClient = useQueryClient()

  const form = useForm<ImportarInscricoesDto>({ reValidateMode: 'onChange' })

  const { handleSubmit, formState } = form
  const { dirtyFields, isSubmitted, isSubmitting } = formState
  const isDirty = Object.keys(dirtyFields).length > 0

  useBlocker((isDirty && !isSubmitted) || isSubmitting)

  const { mutateAsync: importInscricoes } = useChamadasImportarInscricoesSuap({
    mutation: {
      onSuccess(data) {
        handleInscricaoSuccess(data)
        setOpen(false)
        void queryClient.invalidateQueries({ queryKey: getChamadasGetOneWithInscricoesQueryKey(chamada.id) })
      },
      onError: handleInscricaoError
    }
  })

  const onSubmit: SubmitHandler<ImportarInscricoesDto> = async (data) => {
    await importInscricoes({ id: chamada.id, data })
  }

  return (
    <FormProvider {...form}>
      <DialogRoot lazyMount open={open} onOpenChange={(e) => setOpen(e.open)}>
        <DialogTrigger asChild>{children}</DialogTrigger>

        <DialogContent>
          <form noValidate onSubmit={handleSubmit(onSubmit)}>
            <DialogHeader>
              <DialogTitle>Importar inscrições do SUAP</DialogTitle>
            </DialogHeader>

            <DialogBody>
              <Text textStyle="xs" mb={2}>
                Para importar as inscrições, exporte o arquivo de inscrições do SUAP em formato Excel (.xls ou .xlsx) e
                faça o upload abaixo. Caso você já tenha importado antes, as inscrições serão atualizadas conforme os
                dados correspondentes no arquivo
              </Text>

              <FileField<ImportarInscricoesDto>
                name="file"
                secondaryText=".xls, .xlsx até 5MB"
                maxFiles={1}
                accept={[
                  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                  'application/vnd.ms-excel'
                ]}
                maxFileSize={5 * 1024 * 1024} // 5MB
                required
              />

              <Collapsible.Root unmountOnExit>
                <Collapsible.Trigger paddingY="3" as="div">
                  <Button variant="ghost">
                    Ver exemplo de planilha <RiArrowDropDownLine />
                  </Button>
                </Collapsible.Trigger>
                <Collapsible.Content>
                  <Heading mb={4}>Exemplo de planilha</Heading>
                  <SheetExample />
                </Collapsible.Content>
              </Collapsible.Root>
            </DialogBody>

            <DialogFooter>
              <Button type="submit" loading={form.formState.isSubmitting} loadingText="Importando...">
                Importar
              </Button>
            </DialogFooter>

            <DialogCloseTrigger />
          </form>
        </DialogContent>
      </DialogRoot>
    </FormProvider>
  )
}

export function handleInscricaoSuccess(data: ImportarInscricoesResponseDto) {
  if (data.errors.length) {
    toaster.warning({
      title: 'Alguns erros ocorreram durante a importação',
      description: data.errors.map((error) => `• ${error}`).join('\n'),
      duration: 10000,
      closable: true
    })
  } else {
    toaster.success({
      title: 'Importação concluída com sucesso!',
      description: 'As inscrições dos alunos do SUAP foram importadas com sucesso'
    })
  }
}

function handleInscricaoError(error: unknown) {
  toastError(error, {
    title: 'Erro ao importar inscrições',
    duration: Infinity
  })
}

const INSCRICOES_EXEMPLO = [
  {
    inscricao: 'JOSE DA SILVA (202510000001) - EDITAL No. 06/2025 - CAMPUS PICUI - PROGRAMA DE ALIMENTACAO',
    operacao: 'Confirmacao',
    inicio_periodo: '01/01/2025',
    fim_periodo: '01/01/2025'
  },
  {
    inscricao: 'JOSE DA SILVA (202510000001) - EDITAL No. 06/2025 - CAMPUS PICUI - PROGRAMA DE ALIMENTACAO',
    operacao: 'Cancelamento',
    inicio_periodo: '01/01/2025',
    fim_periodo: '01/01/2025'
  },
  {
    inscricao: 'MARIA OLIVEIRA (202510000002) - EDITAL No. 06/2025 - CAMPUS PICUI - PROGRAMA DE ALIMENTACAO',
    operacao: 'Confirmacao',
    inicio_periodo: '01/01/2025',
    fim_periodo: '01/01/2025'
  }
]

function SheetExample() {
  return (
    <Box overflow="hidden" w="full">
      <Table.ScrollArea borderWidth="1px" w="full">
        <Table.Root size="sm">
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeader whiteSpace="nowrap">#</Table.ColumnHeader>
              <Table.ColumnHeader whiteSpace="nowrap">inscricao</Table.ColumnHeader>
              <Table.ColumnHeader whiteSpace="nowrap">operacao</Table.ColumnHeader>
              <Table.ColumnHeader whiteSpace="nowrap">inicio_periodo</Table.ColumnHeader>
              <Table.ColumnHeader whiteSpace="nowrap">fim_periodo</Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {INSCRICOES_EXEMPLO.map((inscricao, index) => (
              <Table.Row key={index}>
                <Table.Cell whiteSpace="nowrap">{index + 1}</Table.Cell>
                <Table.Cell whiteSpace="nowrap">{inscricao.inscricao}</Table.Cell>
                <Table.Cell whiteSpace="nowrap">{inscricao.operacao}</Table.Cell>
                <Table.Cell whiteSpace="nowrap">{inscricao.inicio_periodo}</Table.Cell>
                <Table.Cell whiteSpace="nowrap">{inscricao.fim_periodo}</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      </Table.ScrollArea>
    </Box>
  )
}
