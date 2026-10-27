import { useAlunosConfigurarNotificacoes } from '@/api/endpoints/alunos'
import { CreatePreferenciaNotificacaoDto } from '@/api/endpoints/api.schemas'
import { getAuthMeQueryKey } from '@/api/endpoints/authentication'
import { useAuth } from '@/contexts/auth'
import { Box, Button, Heading, Stack, Text } from '@chakra-ui/react'
import { useQueryClient } from '@tanstack/react-query'
import { FormProvider, useForm } from 'react-hook-form'
import useSessionStorageState from 'use-session-storage-state'
import { toastError } from '../error/toast-error'
import { DialogBody, DialogContent, DialogFooter, DialogHeader, DialogRoot, DialogTitle } from '../ui/dialog'
import { toaster } from '../ui/toaster'
import { NotificationsSetup } from './notifications'

export function Notifications() {
  const { me } = useAuth()
  const queryClient = useQueryClient()
  const [dismissed, setDismissed] = useSessionStorageState('setup.notifications.dismissed', { defaultValue: false })

  const form = useForm<CreatePreferenciaNotificacaoDto>({
    defaultValues: {
      notificacoes: [{ refeicaoId: null, porEmail: true, porWhatsApp: true }]
    }
  })

  const { mutateAsync: definirPreferencias, isPending } = useAlunosConfigurarNotificacoes({
    mutation: {
      async onSuccess() {
        toaster.success({
          title: 'Suas preferências de notificações foram salvas',
          description: 'Você pode alterá-las a qualquer momento entrando na página do seu perfil'
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

  const handleDismiss = () => {
    setDismissed(true)
    toaster.warning({
      title: 'Você pode alterar as configurações de notificações entrando na página do seu perfil'
    })
  }

  const onSubmit = async (data: CreatePreferenciaNotificacaoDto) => {
    await definirPreferencias({ data })
  }

  if (!me) return null
  if (!me.aluno) return null
  if (me.aluno.notificacoesConfiguradas) return null

  return (
    <DialogRoot open={!dismissed}>
      <DialogContent>
        <FormProvider {...form}>
          <form noValidate onSubmit={form.handleSubmit(onSubmit)}>
            <DialogHeader>
              <DialogTitle>Selecione as notificações que deseja receber</DialogTitle>
            </DialogHeader>

            <DialogBody>
              <Stack gap={2}>
                <Text>Você pode escolher quais refeições receberá notificações, e também através de quais canais.</Text>

                <Box>
                  <Heading as="h2" textStyle="md">
                    Seu E-mail
                  </Heading>
                  <Box color="fg.muted">{me.user?.email}</Box>
                </Box>

                <Box>
                  <Heading as="h2" textStyle="md">
                    Seu WhatsApp
                  </Heading>
                  <Box color="fg.muted">{me.user?.phone}</Box>
                </Box>

                <Heading as="h2" textStyle="md">
                  Refeições disponíveis
                </Heading>

                <NotificationsSetup />
              </Stack>
            </DialogBody>

            <DialogFooter>
              <Button onClick={handleDismiss} variant="ghost">
                Depois
              </Button>
              <Button type="submit" loading={isPending}>
                Pronto
              </Button>
            </DialogFooter>
          </form>
        </FormProvider>
      </DialogContent>
    </DialogRoot>
  )
}
