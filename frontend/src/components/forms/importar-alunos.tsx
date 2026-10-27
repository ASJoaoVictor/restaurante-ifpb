import { useAlunosImportar } from '@/api/endpoints/alunos'
import { ImportarAlunosDto, ImportarAlunosResponseDto } from '@/api/endpoints/api.schemas'
import { useBlocker } from '@/hooks/use-blocker'
import { Alert, Box, Button, Span, Text, VStack } from '@chakra-ui/react'
import { FormProvider, SubmitHandler, useForm, useWatch } from 'react-hook-form'
import { RiUploadLine } from 'react-icons/ri'
import { toastError } from '../error/toast-error'
import { SwitchField } from '../fields/common/basic-fields'
import { FileField } from '../fields/common/file.field'
import { toaster } from '../ui/toaster'
import { InfoTip } from '../ui/toggle-tip'

export function ImportarAlunosForm() {
  const form = useForm<ImportarAlunosDto>({
    defaultValues: { excluirAlunosNaoListados: true }
  })

  const { control, handleSubmit } = form
  const excluirAlunosNaoListados = useWatch({ control, name: 'excluirAlunosNaoListados' })

  const {
    mutate: importarAlunos,
    isPending,
    isSuccess
  } = useAlunosImportar({
    mutation: {
      onSuccess: handleImportSuccess,
      onError: handleImportError
    }
  })

  useBlocker(isPending)

  const onSubmit: SubmitHandler<ImportarAlunosDto> = (data) => {
    importarAlunos({ data })
  }

  return (
    <FormProvider {...form}>
      <form noValidate onSubmit={handleSubmit(onSubmit)}>
        <VStack gap={4} alignItems="stretch">
          <Alert.Root status="warning" hidden={!excluirAlunosNaoListados}>
            <Alert.Indicator />
            <Alert.Title>Atenção: Inclua o arquivo com TODOS os alunos do campus</Alert.Title>
          </Alert.Root>

          <FileField<ImportarAlunosDto>
            name="file"
            secondaryText=".xls, .xlsx até 5MB"
            maxFiles={1}
            accept={['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel']}
            maxFileSize={5 * 1024 * 1024} // 5MB
            required
            disabled={isSuccess}
          />

          <ImportInstructions excluirAlunosNaoListados={excluirAlunosNaoListados} />

          <SwitchField<ImportarAlunosDto> name="excluirAlunosNaoListados" disabled={isSuccess}>
            Excluir alunos antigos (recomendado)
            <InfoTip>
              <Box maxW="sm">
                Se ativado, os alunos que não estiverem na planilha serão removidos do sistema. Caso a planilha NÃO
                contenha TODOS os alunos do campus, desative esta opção. Isso é importante para evitar que os alunos que
                não estão estudando no IFPB tenham acesso ao sistema.
              </Box>
            </InfoTip>
          </SwitchField>

          <Button
            type="submit"
            disabled={isSuccess}
            loadingText="Importação em andamento, aguarde..."
            loading={isPending}
          >
            <RiUploadLine />
            Importar
          </Button>
        </VStack>
      </form>
    </FormProvider>
  )
}

function handleImportSuccess(data: ImportarAlunosResponseDto) {
  const messages = [
    `Foram importados ${data.alunosImportados} alunos`,
    `Foram encontrados ${data.alunosNaoMatriculados} alunos que não estavam matriculados e foram ignorados`,
    `Foram removidos ${data.alunosRemovidos} alunos que não estavam mais na lista`
  ]

  if (data.alunosSemEmailAcademico > 0) {
    messages.push(`${data.alunosSemEmailAcademico} alunos não foram importados por não terem e-mail acadêmico`)
  }

  toaster.success({
    title: 'Alunos importados com sucesso',
    description: messages.join('\n'),
    duration: Infinity,
    closable: true
  })
}

function handleImportError(error: any) {
  toastError(error, {
    title: 'Erro ao importar alunos',
    duration: Infinity
  })
}

function ImportInstructions({ excluirAlunosNaoListados }: { excluirAlunosNaoListados: boolean }) {
  return (
    <Text textStyle="xs">
      Ao clicar no botão importar, o arquivo será enviado ao servidor, será feita uma análise de erros e, se tudo
      estiver correto, os alunos existentes serão atualizados, os novos serão criados
      <Span hidden={!excluirAlunosNaoListados}> e os alunos que não estiverem na lista serão removidos</Span>.
    </Text>
  )
}
