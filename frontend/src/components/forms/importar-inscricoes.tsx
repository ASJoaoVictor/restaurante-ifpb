import { Chamada, ImportarInscricoesDto, ImportarInscricoesResponseDto } from '@/api/endpoints/api.schemas'
import { getChamadasGetOneWithInscricoesQueryKey, useChamadasImportarInscricoes } from '@/api/endpoints/chamadas'
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

export function ImportarInscricoesForm({ chamada, children }: { chamada: Chamada } & PropsWithChildren) {
  const [open, setOpen] = useState(false)
  const queryClient = useQueryClient()

  const form = useForm<ImportarInscricoesDto>({ reValidateMode: 'onChange' })

  const { handleSubmit, formState } = form
  const { dirtyFields, isSubmitted, isSubmitting } = formState
  const isDirty = Object.keys(dirtyFields).length > 0

  useBlocker((isDirty && !isSubmitted) || isSubmitting)

  const { mutateAsync: importInscricoes } = useChamadasImportarInscricoes({
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
              <DialogTitle>Importar inscrições de planilha</DialogTitle>
            </DialogHeader>

            <DialogBody>
              <Text textStyle="xs" mb={2}>
                Para importar as inscrições, crie uma planilha em formato Excel (.xls ou .xlsx) e inclua a matrícula dos
                alunos inscritos na coluna &quot;Matrícula&quot; conforme o exemplo e faça o upload abaixo. Caso você já
                tenha importado antes, as inscrições serão atualizadas conforme os dados correspondentes no arquivo
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
      description: 'As inscrições dos alunos foram importadas com sucesso'
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
  { matricula: '202510000001' },
  { matricula: '202510000002' },
  { matricula: '202510000003' },
  { matricula: '202510000004' },
  { matricula: '202510000005' },
  { matricula: '202510000006' },
  { matricula: '202510000007' },
  { matricula: '202510000008' },
  { matricula: '202510000009' }
]

function SheetExample() {
  return (
    <Box overflow="hidden" w="full">
      <Table.ScrollArea borderWidth="1px" w="full">
        <Table.Root size="sm">
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeader whiteSpace="nowrap">Matrícula</Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {INSCRICOES_EXEMPLO.map((inscricao, index) => (
              <Table.Row key={index}>
                <Table.Cell whiteSpace="nowrap">{inscricao.matricula}</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      </Table.ScrollArea>
    </Box>
  )
}
