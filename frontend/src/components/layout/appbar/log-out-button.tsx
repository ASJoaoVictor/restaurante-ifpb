import { getAuthMeQueryKey, useAuthLogout } from '@/api/endpoints/authentication'
import { getError } from '@/components/error/get-error'
import { toaster } from '@/components/ui/toaster'
import { useAuth } from '@/contexts/auth'
import { LOGGED_OUT_ME } from '@/contexts/stored-me'
import { Button, IconButtonProps } from '@chakra-ui/react'
import { useQueryClient } from '@tanstack/react-query'
import { RiLogoutCircleRLine } from 'react-icons/ri'

export function LogOutButton(props: IconButtonProps) {
  const queryClient = useQueryClient()
  const { me, removeStoredMe } = useAuth()

  const { mutateAsync: logout } = useAuthLogout({
    mutation: {
      async onSuccess() {
        // Atualiza o usuário autenticado
        removeStoredMe()
        await queryClient.setQueryData(getAuthMeQueryKey(), LOGGED_OUT_ME)
      }
    }
  })

  const handleLogout = () => {
    toaster.promise(logout(), {
      success: {
        title: 'Desconectado com sucesso',
        description: 'Você foi desconectado da sua conta.'
      },
      error(error: any) {
        return {
          title: 'Erro ao desconectar',
          description: getError(error).description
        }
      },
      loading: {
        title: 'Desconectando...',
        description: 'Aguarde enquanto desconectamos você da sua conta.'
      }
    })
  }

  return (
    <Button
      aria-label="Sair do sistema"
      color="fg.error"
      size="sm"
      p={2}
      hidden={!me.user}
      w="100%"
      justifyContent="flex-start"
      _hover={{ bg: 'bg.error', color: 'fg.error' }}
      {...props}
      onClick={handleLogout}
    >
      <RiLogoutCircleRLine />
      Sair
    </Button>
  )
}
