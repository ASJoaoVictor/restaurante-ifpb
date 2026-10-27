import { useAuth } from '@/contexts/auth'
import { Box, CardBody, CardRoot, Center, Text, VStack } from '@chakra-ui/react'
import { Link } from '@tanstack/react-router'
import { MdArrowForward } from 'react-icons/md'
import { MenuItem, menuList } from '../../../enums/menu-list'

export function AcoesRapidas() {
  const { me } = useAuth()

  const userRoles = me?.user?.roles ?? []
  const menuListFiltered = menuList.filter((menu) => {
    if (!menu.role) return true
    if (menu.hideInAdmin) return false
    return menu.role.some((role) => userRoles.includes(role))
  })

  return (
    <VStack gap={2} align="stretch">
      {menuListFiltered.map((menu, index) => (
        <CardAcaoRapida key={index} menu={menu} />
      ))}
    </VStack>
  )
}

function CardAcaoRapida({ menu }: { menu: MenuItem }) {
  return (
    <CardRoot
      rounded="sm"
      borderInlineStartWidth={4}
      borderInlineStartColor={menu.borderColor}
      _hover={{ bg: 'colorPalette.panel' }}
      _focusVisible={{ bg: 'colorPalette.panel' }}
      transition="background-color 0.2s"
      asChild
    >
      <Link to={menu.url}>
        <CardBody p={{ base: 6, md: 8 }}>
          <Center gap={4} role="group">
            <Box p={3} rounded="sm" bg={menu.color}>
              <menu.icon size={22} />
            </Box>
            <Box flex={1}>
              <Text fontSize="md" fontWeight="semibold" color="gray.800">
                {menu.label}
              </Text>
              <Text fontSize="sm" color="gray.500">
                {menu.description}
              </Text>
            </Box>
            <Center rounded="full" w={8} h={8}>
              <MdArrowForward />
            </Center>
          </Center>
        </CardBody>
      </Link>
    </CardRoot>
  )
}
