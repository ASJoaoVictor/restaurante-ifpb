import { useAuth } from '@/contexts/auth'
import { Box, Container, Flex, IconButton } from '@chakra-ui/react'
import { Link } from '@tanstack/react-router'
import { RiQrCodeLine } from 'react-icons/ri'
import { Logo } from '../../common/logo'
import { Tooltip } from '../../ui/tooltip'
import { AppBarDrawer } from './drawer'
import { AppBarUser } from './user'

export function AppBar() {
  const { me } = useAuth()
  return (
    <Box bg="bg.panel" borderBottomWidth={1}>
      <Container maxW="7xl">
        <Flex align="center" gap={4} py={2}>
          <AppBarDrawer />

          <Link to="/">
            <Logo />
          </Link>

          <Box flex={1} />

          <Tooltip content="Seu QR Code">
            <IconButton asChild aria-label="Seu QR Code" variant="ghost" hidden={!me.user?.isAluno}>
              <Link to="/qrcode">
                <RiQrCodeLine />
              </Link>
            </IconButton>
          </Tooltip>

          <AppBarUser />
        </Flex>
      </Container>
    </Box>
  )
}
