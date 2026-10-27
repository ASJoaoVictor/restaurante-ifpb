import comendoLanche from '@/assets/img/alunos-sentados-a-mesa-comendo-refeicao-na-escola.jpg'
import logoIFPB from '@/assets/img/logo-ifpb.webp'
import { SignIn } from '@/components/login/sign-in'
import { checkLogout } from '@/utils/auth-helpers'
import { Box, Flex, Image, Stack } from '@chakra-ui/react'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/login')({
  component: RouteComponent,
  head: () => ({ meta: [{ title: 'Login | IFPB Meals' }] }),
  beforeLoad: ({ context }) => {
    checkLogout(context)
  }
})

function RouteComponent() {
  return (
    <Stack
      minH="100vh"
      direction={{ base: 'column', md: 'row' }}
      mdDown={{
        bgImage: `url("${comendoLanche}")`,
        backdropFilter: 'blur(4px)'
      }}
    >
      <SignIn />

      <Flex flex={{ md: 1, lg: 2 }} hideBelow="md" position="relative" overflow="hidden">
        <Image
          src={comendoLanche}
          w="full"
          h="full"
          alt="Alunos sentados à mesa comendo refeição no IFPB"
          objectFit="cover"
          loading="lazy"
          position="absolute"
        />

        <Box position="absolute" bottom={4} right={4} bg="white" rounded="md" p={4} boxShadow="md">
          <Image src={logoIFPB} alt="Instituto Federal Paraíba - Campus Picuí" maxW="100px" loading="lazy" />
        </Box>
      </Flex>
    </Stack>
  )
}
