import { useAlunosMarkWelcomeSeen } from '@/api/endpoints/alunos'
import { getAuthMeQueryKey } from '@/api/endpoints/authentication'
import { useAuth } from '@/contexts/auth'
import { getNome } from '@/utils/formatters'
import { Button, ListIndicator, ListItem, ListRoot, Stack, Text } from '@chakra-ui/react'
import { useQueryClient } from '@tanstack/react-query'
import { RiEditBoxLine, RiFileList3Line, RiNotification3Line, RiTodoLine } from 'react-icons/ri'
import useSessionStorageState from 'use-session-storage-state'
import { toastError } from '../error/toast-error'
import { DialogBody, DialogContent, DialogFooter, DialogHeader, DialogRoot, DialogTitle } from '../ui/dialog'

export function Welcome() {
  const { me } = useAuth()
  const queryClient = useQueryClient()
  const [dismissed, setDismissed] = useSessionStorageState('setup.welcome.dismissed', { defaultValue: false })

  const { mutate } = useAlunosMarkWelcomeSeen({
    mutation: {
      async onSuccess() {
        await queryClient.invalidateQueries({ queryKey: getAuthMeQueryKey() })
      },
      onError(error) {
        toastError(error, {
          title: 'Erro ao marcar tela de boas-vindas como vista'
        })
      }
    }
  })

  const handleDismiss = () => {
    setDismissed(true)
    mutate()
  }

  if (!me) return null
  if (!me.aluno) return null
  if (me.aluno.boasVindas) return null

  return (
    <DialogRoot open={!dismissed}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Boas vindas ao IFPB Meals!</DialogTitle>
        </DialogHeader>

        <DialogBody>
          <Stack gap={2}>
            <Text textStyle="lg">Olá, {getNome(me.user?.name)} 👋</Text>

            <Text>
              Este sistema foi desenvolvido para facilitar o processo de solicitação e seleção de refeições no campus,
              tornando tudo mais <b>rápido</b>, <b>prático</b> e <b>organizado</b>.
            </Text>

            <Text mt={4}>Aqui você poderá:</Text>

            <ListRoot variant="plain" gap={1}>
              <ListItem>
                <ListIndicator asChild color="green.500">
                  <RiEditBoxLine />
                </ListIndicator>
                Realizar sua inscrição para refeições
              </ListItem>
              <ListItem>
                <ListIndicator asChild color="green.500">
                  <RiTodoLine />
                </ListIndicator>
                Acompanhar o status das suas solicitações
              </ListItem>
              <ListItem>
                <ListIndicator asChild color="green.500">
                  <RiFileList3Line />
                </ListIndicator>
                Consultar seu histórico de inscrições e presenças
              </ListItem>
              <ListItem>
                <ListIndicator asChild color="green.500">
                  <RiNotification3Line />
                </ListIndicator>
                Receber notificações sobre as chamadas
              </ListItem>
            </ListRoot>

            <Text mt={4}>
              Se tiver dúvidas ou identificar algum erro, entre em contato com o gestor do sistema ou os desenvolvedores
              através do link no rodapé.
            </Text>
          </Stack>
        </DialogBody>

        <DialogFooter justifyContent="center" pb={6}>
          <Button size="lg" onClick={handleDismiss}>
            Vamos lá!
          </Button>
        </DialogFooter>
      </DialogContent>
    </DialogRoot>
  )
}
