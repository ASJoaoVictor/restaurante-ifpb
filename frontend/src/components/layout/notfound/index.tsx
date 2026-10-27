import { Wrapper } from '@/components/layout/wrapper'
import { Box, Button, Center, Heading, Stack, Text } from '@chakra-ui/react'
import { Link } from '@tanstack/react-router'
import { RiHome2Line } from 'react-icons/ri'

export function NotFound() {
  return (
    <Wrapper display="flex" alignItems="center" justifyContent="center">
      <Stack gap={4} justify="center" align="center" textAlign="center">
        <Box>
          <Heading as="h1" size="7xl" color="red.500">
            404
          </Heading>
          <Heading as="h2" size="3xl">
            Not Found
          </Heading>
        </Box>

        <Stack gap={4} maxW="lg" fontWeight="medium" mb={6}>
          <Text fontSize="xl">Ops! A página que você procura não existe.</Text>

          <Text fontSize="md" color="gray.700">
            Parece que você se perdeu no caminho para o refeitório! A página que você está tentando acessar pode ter
            sido movida, removida ou o link pode estar incorreto.
          </Text>

          <Center>
            <Button asChild aria-label="Voltar para o Início" w="fit-content">
              <Link to="/">
                <RiHome2Line />
                Voltar para o Início
              </Link>
            </Button>
          </Center>
        </Stack>
      </Stack>
    </Wrapper>
  )
}
