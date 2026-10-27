import { useAlunosConfigurarNotificacoes } from '@/api/endpoints/alunos'
import { CreatePreferenciaNotificacaoDto } from '@/api/endpoints/api.schemas'
import { getAuthMeQueryKey } from '@/api/endpoints/authentication'
import { toastError } from '@/components/error/toast-error'
import { NotificationsSetup } from '@/components/setup/notifications'
import { Alert } from '@/components/ui/alert'
import { toaster } from '@/components/ui/toaster'
import { Button } from '@chakra-ui/react'
import { useQueryClient } from '@tanstack/react-query'
import { FormProvider, useForm } from 'react-hook-form'
import { RiSaveLine } from 'react-icons/ri'

export function Notificacoes() {
  const queryClient = useQueryClient()

  const form = useForm<CreatePreferenciaNotificacaoDto>({
    defaultValues: {
      notificacoes: [{ refeicaoId: null, porEmail: false, porWhatsApp: false }]
    }
  })

  const { mutateAsync: definirPreferencias, isPending } = useAlunosConfigurarNotificacoes({
    mutation: {
      async onSuccess() {
        toaster.success({
          title: 'Suas preferências de notificações foram salvas'
        })
        await queryClient.invalidateQueries({ queryKey: getAuthMeQueryKey() })
      },
      onError(error) {
        toastError(error, {
          title: 'Erro ao definir preferências de notificações'
        })
      }
    }
  })

  const onSubmit = async (data: CreatePreferenciaNotificacaoDto) => {
    await definirPreferencias({ data })
  }

  return (
    <FormProvider {...form}>
      <form noValidate onSubmit={form.handleSubmit(onSubmit)}>
        <Alert
          status="info"
          title="Você receberá notificações de chamadas que você inscreveu, independente das configurações abaixo"
          mb={4}
          w="fit-content"
        />
        <NotificationsSetup />
        <Button type="submit" loading={isPending} mt={4}>
          <RiSaveLine />
          Salvar
        </Button>
      </form>
    </FormProvider>
  )
}
