import { FORM_LINK } from '@/enums/links'
import {
  chakra,
  Link as ChakraLink,
  Container,
  Flex,
  GridItem,
  Heading,
  HStack,
  List,
  Separator,
  SimpleGrid,
  Span,
  Stack,
  Text,
  VStack
} from '@chakra-ui/react'
import { RiBugLine, RiHeartLine, RiInformationLine, RiLightbulbLine } from 'react-icons/ri'
import { Logo } from '../../common/logo'

const Link = chakra(ChakraLink, {
  base: {
    w: 'fit-content',
    zIndex: '0'
  }
})

export function Footer() {
  return (
    <chakra.footer bg="gray.50" py={8} borderTopWidth={1}>
      <Container maxW="7xl">
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={{ base: 8, md: 16 }}>
          <GridItem colSpan={{ base: 1, md: 2, lg: 1 }}>
            <Stack gap={4}>
              <Logo />

              <Text color="fg.muted" textStyle="sm">
                Sistema do Instituto Federal da Paraíba para solicitação de refeições, oferecendo praticidade e rapidez
                aos alunos e reduzindo processos manuais da gestão.
              </Text>
            </Stack>
          </GridItem>

          <Stack gap={4}>
            <Heading>Links úteis</Heading>

            <List.Root gap={2} variant="plain">
              <List.Item asChild>
                <Link href="/sobre">
                  <List.Indicator asChild>
                    <RiInformationLine />
                  </List.Indicator>
                  Sobre
                </Link>
              </List.Item>
              <List.Item asChild>
                <Link href={FORM_LINK} target="_blank">
                  <List.Indicator asChild>
                    <RiBugLine />
                  </List.Indicator>
                  Reportar Erro
                </Link>
              </List.Item>
              <List.Item asChild>
                <Link href={FORM_LINK} target="_blank">
                  <List.Indicator asChild>
                    <RiLightbulbLine />
                  </List.Indicator>
                  Dar Sugestões
                </Link>
              </List.Item>
            </List.Root>
          </Stack>

          <Stack gap={4}>
            <Heading>IFPB Picuí</Heading>

            <List.Root gap={2} variant="plain">
              <List.Item asChild>
                <Link href="https://www.ifpb.edu.br/picui" target="_blank">
                  Site
                </Link>
              </List.Item>
              <List.Item asChild>
                <Link href="https://api.whatsapp.com/send/?phone=558331427330" target="_blank">
                  WhatsApp
                </Link>
              </List.Item>
              <List.Item asChild>
                <Link href="https://www.instagram.com/ifpb.picui/" target="_blank">
                  Instagram
                </Link>
              </List.Item>
            </List.Root>
          </Stack>
        </SimpleGrid>

        <Separator my={8} />

        <SimpleGrid gap={{ base: 8, md: 16 }} columns={{ base: 1, md: 2, lg: 3 }} color="fg.muted">
          <GridItem colSpan={{ base: 1, lg: 2 }}>
            <Text textStyle="sm">© {new Date().getFullYear()} Instituto Federal da Paraíba, Campus Picuí</Text>
          </GridItem>
          <VStack align="flex-start" gap={1}>
            <Flex align="center" gap={1.5} wrap="wrap" fontWeight="medium">
              Desenvolvido com{' '}
              <Span color="red.solid">
                <RiHeartLine />
              </Span>{' '}
              por:
            </Flex>
            <HStack separator={<Span border={0}>•</Span>} textStyle="sm" wrap="wrap">
              <Link target="_blank" href="https://github.com/josejefferson/">
                Jefferson Dantas
              </Link>
              <Link target="_blank" href="https://github.com/kayoronald">
                Kayo Ronald
              </Link>{' '}
              <Link target="_blank" href="https://github.com/marcostsi">
                Marcos Paulo
              </Link>{' '}
            </HStack>
            <Text textStyle="xs">Estudantes de Sistemas para Internet - IFPB Picuí</Text>
          </VStack>
        </SimpleGrid>
      </Container>
    </chakra.footer>
  )
}
