import { Wrapper } from '@/components/layout/wrapper'
import { Stack, Heading, Text, Box, Button, Center } from '@chakra-ui/react'
import { createFileRoute, Link } from '@tanstack/react-router'
import { RiHome2Line } from 'react-icons/ri'

export const Route = createFileRoute('/403')({
  component: RouteComponent,
  head: () => ({ meta: [{ title: '403 Forbidden | IFPB Meals' }] })
})

function RouteComponent() {
  return (
    <Wrapper display="flex" alignItems="center" justifyContent="center">
      <Stack gap={4} justify="center" align="center" textAlign="center">
        <Box>
          <Heading as="h1" size="7xl" color="red.500">
            403
          </Heading>
          <Heading as="h2" size="3xl">
            Forbidden
          </Heading>
        </Box>

        <Stack gap={4} maxW="lg" fontWeight="medium" mb={6}>
          <Text fontSize="xl">Ops! Você não tem permissão para acessar esta página.</Text>

          <Text fontSize="md" color="gray.700">
            Você não tem permissão para acessar esta página. Se acredita que isso é um erro, entre em contato com o
            administrador.
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
