import { Logo } from '@/components/common/logo'
import { useAuth } from '@/contexts/auth'
import { menuList } from '@/enums/menu-list'
import { Button, CloseButton, Drawer, IconButton, Portal, VStack } from '@chakra-ui/react'
import { Link, MatchRoute } from '@tanstack/react-router'
import { useRef } from 'react'
import { RiMenuFill } from 'react-icons/ri'
import { LogOutButton } from './log-out-button'

export function AppBarDrawer() {
  const { me } = useAuth()
  const initialFocus = useRef<HTMLButtonElement>(null)

  const userRoles = me?.user?.roles ?? []
  const menuListFiltered = menuList.filter((menu) => {
    if (!menu.role) return true
    return menu.role.some((role) => userRoles.includes(role))
  })

  return (
    <Drawer.Root placement="start" initialFocusEl={() => initialFocus.current} lazyMount>
      <Drawer.Trigger asChild>
        <IconButton aria-label="Menu" variant="ghost">
          <RiMenuFill />
        </IconButton>
      </Drawer.Trigger>

      <Portal>
        <Drawer.Backdrop />
        <Drawer.Positioner as="aside">
          <Drawer.Content>
            <Drawer.Header>
              <Logo />
            </Drawer.Header>
            <Drawer.Body as="nav" px={2}>
              <VStack as="ul" gap={0} align="stretch" hidden={!me.user}>
                {menuListFiltered.map((menu, menuIndex) => (
                  <MatchRoute to={menu.url} key={menuIndex}>
                    {(match) => (
                      <Button asChild w="full" justifyContent="flex-start" variant={match ? 'solid' : 'ghost'}>
                        <Link to={menu.url}>
                          <menu.icon />
                          {menu.label}
                        </Link>
                      </Button>
                    )}
                  </MatchRoute>
                ))}
              </VStack>
            </Drawer.Body>
            <Drawer.Footer p={2}>
              <LogOutButton variant="subtle" colorPalette="red" />
            </Drawer.Footer>
            <Drawer.CloseTrigger asChild>
              <CloseButton size="sm" top={2} />
            </Drawer.CloseTrigger>
          </Drawer.Content>
        </Drawer.Positioner>
      </Portal>
    </Drawer.Root>
  )
}
