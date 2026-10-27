import { MeDto } from '@/api/endpoints/api.schemas'
import { getAuthMeQueryKey, useAuthLoginEmail } from '@/api/endpoints/authentication'
import { toastError } from '@/components/error/toast-error'
import { NotFound } from '@/components/layout/notfound'
import { Wrapper } from '@/components/layout/wrapper'
import { toaster } from '@/components/ui/toaster'
import { sleep } from '@/utils/helpers'
import { Button, Input } from '@chakra-ui/react'
import { useQueryClient } from '@tanstack/react-query'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'

export const Route = createFileRoute('/dev')({
  component: import.meta.env.PROD ? NotFound : RouteComponent
})

function RouteComponent() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')

  const { mutateAsync: login } = useAuthLoginEmail({
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
      },
      onError: (err) => toastError(err)
    }
  })

  const handleLogin = async () => {
    await login({ email })
    await navigate({ to: '/' })
  }

  return (
    <Wrapper title="Login">
      <Input type="email" placeholder="E-mail" value={email} onChange={(e) => setEmail(e.target.value)} />
      <Button onClick={handleLogin}>Login</Button>
    </Wrapper>
  )
}
