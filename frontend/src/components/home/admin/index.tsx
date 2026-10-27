import { Stack, Flex, Heading, Button } from '@chakra-ui/react'
import { AcoesRapidas } from './acoes-rapidas'
import { ChamadasRecentes } from './chamadas-recentes'
import { useAuth } from '@/contexts/auth'
import { RiAddLine } from 'react-icons/ri'
import { Link } from '@tanstack/react-router'

export function HomeAdmin() {
  const { me } = useAuth()
  const roles = me.user?.roles

  const podeAdicionarChamada = roles?.some((role) => ['admin', 'gestor'].includes(role))

  return (
    <Flex mt={8} gap={8} direction={{ base: 'column', md: 'row' }}>
      <Stack gap={4} flex={1}>
        <Heading as="h2">Gerenciamento</Heading>
        <AcoesRapidas />
      </Stack>

      <Stack gap={4} flex={1}>
        <Flex>
          <Heading as="h2" flex={1}>
            Chamadas recentes
          </Heading>
          {podeAdicionarChamada && (
            <Button size="xs" asChild>
              <Link to="/admin/chamadas/adicionar">
                <RiAddLine /> Adicionar
              </Link>
            </Button>
          )}
        </Flex>
        <ChamadasRecentes />
      </Stack>
    </Flex>
  )
}
