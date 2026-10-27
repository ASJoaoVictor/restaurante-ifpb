import { UsuarioFoto } from '@/components/resources/usuarios/foto'
import { useAuth } from '@/contexts/auth'
import { ROLES } from '@/enums/roles'
import { isSuspenso } from '@/utils/aluno'
import { Badge, Box, Button, Flex, IconButton, Menu, Span, Wrap } from '@chakra-ui/react'
import { Link } from '@tanstack/react-router'
import dayjs from 'dayjs'
import { RiLoginCircleLine, RiUserLine } from 'react-icons/ri'
import { LogOutButton } from './log-out-button'

export function AppBarUser() {
  const { me } = useAuth()

  if (!me.user) {
    return (
      <Button asChild variant="ghost" size="lg">
        <Link to="/login">
          <RiLoginCircleLine />
          <Box>
            <Span hideBelow="sm" mr={0}>
              Fazer{' '}
            </Span>
            Login
          </Box>
        </Link>
      </Button>
    )
  }

  return (
    <Menu.Root lazyMount>
      <Menu.Trigger asChild>
        <IconButton variant="plain">
          <UsuarioFoto usuario={me.user} size="md" />
        </IconButton>
      </Menu.Trigger>

      <Menu.Positioner>
        <Menu.Content minW="2xs">
          <Flex gap={2} p={2}>
            <UsuarioFoto usuario={me.user} />
            <Box>
              <Box fontWeight="medium">{me.user.name}</Box>
              <Box color="fg.muted" fontSize="xs">
                {me.user.email}
              </Box>
              <Wrap mt={2}>
                {me.user.roles?.map((role) => (
                  <Badge key={role}>{ROLES[role]}</Badge>
                ))}

                {!!me.aluno?.faltas && (
                  <Badge colorPalette="orange">
                    {me.aluno?.faltas} falta{me.aluno?.faltas !== 1 ? 's' : ''}
                  </Badge>
                )}

                {!!me.aluno?.suspensoAte && isSuspenso(me.aluno) && (
                  <Badge colorPalette="red">Suspenso até {dayjs(me.aluno?.suspensoAte).format('DD [de] MMMM')}</Badge>
                )}
              </Wrap>
            </Box>
          </Flex>

          <Menu.Separator />

          {me.user?.isAluno && (
            <Menu.Item value="meu-perfil" asChild>
              <Button variant="ghost" size="sm" p={2} w="100%" justifyContent="flex-start" asChild>
                <Link to="/meu-perfil">
                  <RiUserLine />
                  Meu Perfil
                </Link>
              </Button>
            </Menu.Item>
          )}

          <Menu.Item value="logout" asChild>
            <LogOutButton variant="ghost" />
          </Menu.Item>
        </Menu.Content>
      </Menu.Positioner>
    </Menu.Root>
  )
}
