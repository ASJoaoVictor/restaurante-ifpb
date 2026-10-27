import { MeDto } from '@/api/endpoints/api.schemas'
import { getAuthMeQueryKey, useAuthLogin } from '@/api/endpoints/authentication'
import { toaster } from '@/components/ui/toaster'
import { sleep } from '@/utils/helpers'
import { Box, Button, Center, Text } from '@chakra-ui/react'
import { CredentialResponse, GoogleLogin } from '@react-oauth/google'
import { useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { getError } from '../error/get-error'

export function GoogleButtonLogin() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const { isPending, error, mutate } = useAuthLogin({
    mutation: {
      async onSuccess(data) {
        // Atualiza o usuário autenticado
        await queryClient.setQueryData(getAuthMeQueryKey(), data satisfies MeDto)

        // Redireciona para a página inicial
        // Usamos sleep para garantir que o estado seja atualizado antes da navegação
        await sleep(0)
        await navigate({ to: '/' })

        // Exibe mensagem de sucesso
        toaster.success({
          title: 'Login bem-sucedido',
          description: `Bem-vindo(a) de volta, ${data.user.name}!`
        })
      }
    }
  })

  const handleSuccess = async (credentialResponse: CredentialResponse) => {
    mutate({ data: { token: credentialResponse.credential! } })
  }

  const handleError = () => {
    toaster.error({
      title: 'Erro ao fazer login',
      description: 'Por favor, tente novamente mais tarde.'
    })
  }

  return (
    <Box>
      <Button loading loadingText="Fazendo login..." colorPalette="blue" w={60} rounded="xs" hidden={!isPending} />
      <Center visibility={isPending ? 'hidden' : 'visible'} height={isPending ? 0 : 'auto'}>
        <GoogleLogin
          use_fedcm_for_prompt
          use_fedcm_for_button
          ux_mode="popup"
          theme="filled_blue"
          useOneTap
          onSuccess={handleSuccess}
          onError={handleError}
        />
      </Center>

      {error && (
        <Text color="fg.error" fontSize="xs" mt={2}>
          Erro ao fazer login: {getError(error).description}
        </Text>
      )}
    </Box>
  )
}
