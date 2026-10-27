import { FORM_LINK } from '@/enums/links'
import { Box, Card, Center, Link, Separator, Stack, Text } from '@chakra-ui/react'
import { RiInformationLine, RiRestaurantLine } from 'react-icons/ri'
import { GoogleButtonLogin } from './google-button-login'

export function SignIn() {
  return (
    <Center flex={1} p={4}>
      <Card.Root w="full" maxW="sm" textAlign="center">
        <Card.Header>
          <Center
            bgGradient="to-r"
            gradientFrom="teal.500"
            gradientTo="blue.700"
            rounded="full"
            w={16}
            h={16}
            mx="auto"
            mb={4}
            color="white"
          >
            <RiRestaurantLine size={32} />
          </Center>
          <Card.Title fontSize="2xl" bgGradient="to-r" gradientFrom="teal.500" gradientTo="blue.700" bgClip="text">
            Bem-vindo ao IFPB Meals
          </Card.Title>
          <Card.Description>
            Sistema de solicitação de refeições para estudantes do Instituto Federal da Paraíba
          </Card.Description>
        </Card.Header>

        <Card.Body mt={2}>
          <Stack gap={4}>
            <Text fontWeight="semibold" mb={1}>
              O que é o IFPB Meals?
            </Text>

            <Text fontSize="sm" color="fg.muted" lineHeight="tall">
              Uma plataforma digital que permite aos estudantes do IFPB solicitar suas refeições de forma prática e
              organizada, garantindo uma alimentação saudável e acessível no campus.
            </Text>

            <Link href="/sobre" textStyle="xs" justifyContent="center">
              <RiInformationLine />
              Saiba mais
            </Link>

            <GoogleButtonLogin />
          </Stack>
        </Card.Body>

        <Card.Footer>
          <Stack w="full" gap={2}>
            <Text fontSize="sm" color="fg.muted">
              Problemas para acessar?{' '}
              <Link href={FORM_LINK} color="colorScheme.500" fontWeight="medium" target="_blank">
                Clique aqui
              </Link>
            </Text>

            <Separator my={2} />

            <Box fontSize="xs" color="fg.subtle" lineHeight="short">
              <Text>Instituto Federal da Paraíba</Text>
              <Text>Use sua conta institucional do Google para acessar</Text>
            </Box>
          </Stack>
        </Card.Footer>
      </Card.Root>
    </Center>
  )
}
