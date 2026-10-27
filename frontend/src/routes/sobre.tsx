import { Wrapper } from '@/components/layout/wrapper'
import { Avatar } from '@/components/ui/avatar'
import { FORM_LINK } from '@/enums/links'
import { Box, Button, Center, Flex, For, Heading, Link, SimpleGrid, Stack, Text, chakra } from '@chakra-ui/react'
import { createFileRoute } from '@tanstack/react-router'
import { RiArrowRightUpLine, RiCheckboxCircleLine, RiListCheck3, RiMessage3Line, RiSpeedUpLine } from 'react-icons/ri'
import {
  SiDocker,
  SiGithub,
  SiNestjs,
  SiNodedotjs,
  SiPostgresql,
  SiReact,
  SiTypescript,
  SiChakraui,
  SiDrizzle,
  SiVite,
  SiBun,
  SiZod,
  SiNginx,
  SiReacthookform
} from 'react-icons/si'

export const Route = createFileRoute('/sobre')({
  component: RouteComponent,
  head: () => ({ meta: [{ title: 'Sobre | IFPB Meals' }] })
})

const benefits = [
  { icon: RiCheckboxCircleLine, title: 'Praticidade', text: 'Solicitações de refeições de forma simples e rápida.' },
  { icon: RiListCheck3, title: 'Organização', text: 'Informações centralizadas em um único sistema.' },
  { icon: RiSpeedUpLine, title: 'Agilidade', text: 'Menos processos manuais no gerenciamento das refeições.' }
]

const developers = [
  {
    nome: 'José Jefferson',
    funcao: 'Desenvolvedor',
    url: 'https://jeffersondantas.vercel.app',
    foto: 'https://github.com/josejefferson.png'
  },
  {
    nome: 'Kayo Ronald',
    funcao: 'Desenvolvedor',
    url: 'https://github.com/KayoRonald',
    foto: 'https://github.com/KayoRonald.png'
  },
  {
    nome: 'Marcos Paulo',
    funcao: 'Desenvolvedor',
    url: 'https://github.com/marcosplira',
    foto: 'https://github.com/marcosplira.png'
  }
]

const academicTeam = [
  { nome: 'Dr. Lucius Vinicius', funcao: 'Banca avaliadora' },
  { nome: 'Dr. Daniel Enos', funcao: 'Banca avaliadora' },
  { nome: 'Dr. André Luiz', funcao: 'Orientador' }
]

const technologies = [
  { icon: SiVite, name: 'Vite', color: 'purple.500', description: 'Ferramenta de build rápida do frontend.' },
  {
    icon: SiReact,
    name: 'React',
    color: 'cyan.500',
    description: 'Interface construída com componentes reutilizáveis.'
  },
  { icon: SiBun, name: 'Bun', color: 'gray.600', description: 'Execução de scripts e gerenciamento de pacotes.' },
  {
    icon: SiTypescript,
    name: 'TypeScript',
    color: 'blue.500',
    description: 'Tipagem segura para um código mais confiável.'
  },
  {
    icon: SiNodedotjs,
    name: 'Node.js',
    color: 'green.600',
    description: 'Ambiente de execução dos serviços da aplicação.'
  },
  {
    icon: SiNestjs,
    name: 'NestJS',
    color: 'red.500',
    description: 'API modular, organizada e preparada para crescer.'
  },
  { icon: SiGithub, name: 'GitHub', color: 'fg', description: 'Versionamento e colaboração no código-fonte.' },
  { icon: SiDocker, name: 'Docker', color: 'blue.400', description: 'Ambientes consistentes por meio de contêineres.' },
  {
    icon: SiPostgresql,
    name: 'PostgreSQL',
    color: 'blue.600',
    description: 'Armazenamento seguro e consistente dos dados.'
  },
  {
    icon: SiChakraui,
    name: 'Chakra UI',
    color: 'teal.500',
    description: 'Componentes acessíveis e responsivos da interface.'
  },
  { icon: SiZod, name: 'Zod', color: 'blue.700', description: 'Validação dos dados recebidos pelo sistema.' },
  {
    icon: SiNginx,
    name: 'Nginx',
    color: 'teal.700',
    description: 'Entrega da aplicação e distribuição das requisições.'
  },
  {
    icon: SiDrizzle,
    name: 'Drizzle',
    color: 'yellow.700',
    description: 'ORM para interagir com o banco de dados de forma segura e eficiente.'
  },
  {
    icon: SiReacthookform,
    name: 'React Hook Form',
    color: 'pink.700',
    description: 'Gerenciamento de formulários com validação eficiente.'
  }
]

function RouteComponent() {
  return (
    <Wrapper maxW="full" p={0} my={0}>
      <chakra.section borderBottomWidth="1px" borderColor="border">
        <Box maxW="7xl" mx="auto" px={{ base: 5, sm: 8 }} py={{ base: 12, sm: 14 }}>
          <Box mb={5} h={1} w={12} rounded="full" bg="primary.500" />

          <Heading as="h1" fontSize={{ base: '3xl', sm: '4xl' }} fontWeight="bold" color="fg">
            Sobre o IFPB Meals
          </Heading>

          <Text mt={5} maxW="3xl" fontSize="md" lineHeight="tall" color="fg">
            O IFPB Meals é um sistema desenvolvido para facilitar a solicitação e o gerenciamento das refeições do
            Restaurante Estudantil do{' '}
            <Link href="https://www.ifpb.edu.br/picui" target="_blank" rel="noopener noreferrer" color="primary.600">
              IFPB — Campus Picuí
            </Link>
            .
          </Text>

          <Text mt={2} maxW="3xl" fontSize="md" lineHeight="tall" color="fg.muted">
            Criado em 2025, o projeto torna a gestão de refeições mais rápida, organizada e acessível. Os estudantes
            solicitam suas refeições de forma prática, enquanto a equipe administrativa acompanha as solicitações e o
            consumo em um só lugar.
          </Text>
        </Box>
      </chakra.section>

      <chakra.section borderBottomWidth="1px" borderColor="border" bg="bg.muted">
        <Box maxW="7xl" mx="auto" px={{ base: 5, sm: 8 }} py={{ base: 12, sm: 14 }}>
          <Heading as="h2" fontSize={{ base: '2xl', sm: '3xl' }} fontWeight="bold" color="fg">
            O projeto
          </Heading>
          <Text mt={4} maxW="3xl" fontSize="md" lineHeight="tall" color="fg.muted">
            Desenvolvido por alunos de Sistemas para Internet do IFPB — Campus Picuí, o sistema foi pensado para
            melhorar a experiência dos estudantes e simplificar o trabalho da equipe do restaurante.
          </Text>

          <SimpleGrid mt={8} gap={4} columns={{ base: 1, md: 3 }}>
            <For each={benefits}>
              {(benefit) => (
                <Stack
                  key={benefit.title}
                  gap={4}
                  h="full"
                  p={{ base: 5, sm: 6 }}
                  borderWidth="1px"
                  borderColor="border"
                  rounded="xl"
                  bg="bg.panel"
                >
                  <Center
                    w={11}
                    h={11}
                    rounded="lg"
                    bg="primary.50"
                    color="primary.700"
                  >
                    <Box as={benefit.icon} boxSize={5} />
                  </Center>

                  <Box>
                    <Heading as="h3" fontSize="lg" fontWeight="semibold" color="fg">
                      {benefit.title}
                    </Heading>
                    <Text mt={1.5} fontSize="sm" lineHeight="tall" color="fg.muted">
                      {benefit.text}
                    </Text>
                  </Box>
                </Stack>
              )}
            </For>
          </SimpleGrid>
        </Box>
      </chakra.section>

      <chakra.section borderBottomWidth="1px" borderColor="border">
        <Box maxW="7xl" mx="auto" px={{ base: 5, sm: 8 }} py={{ base: 12, sm: 14 }}>
          <Heading as="h2" fontSize={{ base: '2xl', sm: '3xl' }} fontWeight="bold" color="fg">
            Quem desenvolveu
          </Heading>
          <Text mt={4} maxW="3xl" fontSize="md" lineHeight="tall" color="fg.muted">
            O IFPB Meals nasceu como trabalho de conclusão de curso de estudantes de Sistemas para Internet do IFPB —
            Campus Picuí.
          </Text>
          <SimpleGrid maxW="5xl" gap={4} columns={{ base: 1, md: 3 }}>
            <For each={developers}>{(person) => <Criador key={person.nome} {...person} />}</For>
          </SimpleGrid>

          <Text
            mt={8}
            mb={3}
            fontSize="xs"
            fontWeight="bold"
            letterSpacing="wide"
            color="fg.muted"
            textTransform="uppercase"
          >
            Orientação e avaliação
          </Text>
          <SimpleGrid maxW="5xl" gap={4} columns={{ base: 1, md: 3 }}>
            <For each={academicTeam}>{(person) => <Criador key={person.nome} {...person} />}</For>
          </SimpleGrid>
        </Box>
      </chakra.section>

      <chakra.section>
        <Box maxW="7xl" mx="auto" px={{ base: 5, sm: 8 }} py={{ base: 12, sm: 14 }}>
          <Heading as="h2" fontSize={{ base: '2xl', sm: '3xl' }} fontWeight="bold" color="fg">
            Tecnologias utilizadas
          </Heading>

          <Text mt={4} maxW="3xl" color="fg.muted" lineHeight="tall">
            O desenvolvimento do IFPB Meals foi realizado com um conjunto moderno de tecnologias, focando em desempenho,
            escalabilidade e facilidade de manutenção.
          </Text>

          <SimpleGrid maxW="7xl" gap={4} columns={{ base: 1, md: 2, lg: 3, xl: 3 }} mt={6}>
            <For each={technologies}>
              {(technology) => (
                <Flex
                  key={technology.name}
                  align="flex-start"
                  gap={4}
                  h="full"
                  p={5}
                  borderWidth="1px"
                  borderColor="border"
                  rounded="lg"
                  bg="bg.panel"
                >
                  <Center boxSize={10} flexShrink={0} rounded="md" bg="bg.muted">
                    <Box as={technology.icon} boxSize={5} color={technology.color} />
                  </Center>

                  <Box>
                    <Text fontWeight="semibold" color="fg">
                      {technology.name}
                    </Text>
                    <Text mt={1} fontSize="sm" lineHeight="tall" color="fg.muted">
                      {technology.description}
                    </Text>
                  </Box>
                </Flex>
              )}
            </For>
          </SimpleGrid>
        </Box>
      </chakra.section>

      <chakra.section>
        <Box maxW="7xl" mx="auto" px={{ base: 5, sm: 5 }} py={{ base: 12, sm: 13 }}>
          <Flex
            direction={{ base: 'column', md: 'row' }}
            align={{ base: 'flex-start', md: 'center' }}
            justify="space-between"
            gap={6}
            p={{ base: 6, sm: 8 }}
            borderWidth="1px"
            borderColor="primary.100"
            rounded="xl"
            bg="primary.50"
          >
            <Flex align="flex-start" gap={4}>
              <Center
                display={{ base: 'none', sm: 'flex' }}
                boxSize={11}
                flexShrink={0}
                rounded="full"
                bg="primary.100"
                color="primary.700"
                hideBelow="md"
              >
                <Box as={RiMessage3Line} boxSize={5} />
              </Center>

              <Box>
                <Heading as="h2" fontSize={{ base: 'xl', sm: '2xl' }} color="fg">
                  Ajude a melhorar o IFPB Meals
                </Heading>
                <Text mt={2} maxW="2xl" color="fg.muted" lineHeight="tall">
                  Se você deseja enviar um feedback ou sugestão sobre o IFPB Meals, fique à vontade para entrar em
                  contato através do nosso formulário. Sua opinião nos ajuda a melhorar continuamente a plataforma.
                </Text>
              </Box>
            </Flex>

            <Button asChild colorPalette="primary" rounded="full" flexShrink={0}>
              <Link href={FORM_LINK} target="_blank" rel="noopener noreferrer">
                <RiMessage3Line />
                Enviar feedback
              </Link>
            </Button>
          </Flex>
        </Box>
      </chakra.section>
    </Wrapper>
  )
}

interface CriadorProps {
  nome: string
  funcao: string
  foto?: string
  url?: string
}

function Criador({ nome, funcao, foto, url }: CriadorProps) {
  return (
    <Flex
      position="relative"
      align="center"
      gap={4}
      minW={0}
      minH={28}
      p={5}
      overflow="hidden"
      borderWidth="1px"
      borderColor="border"
      rounded="lg"
      bg="bg.panel"
    >
      <Box position="absolute" insetY={0} left={0} w={1} bg="primary.500" />

      <Avatar
        name={nome}
        src={foto}
        size="xl"
        flexShrink={0}
        colorPalette="primary"
        outlineWidth="1px"
        outlineStyle="solid"
        outlineColor="primary.200"
        outlineOffset="3px"
      />

      <Stack gap={1.5} minW={0} flex={1}>
        <Text fontSize="lg" fontWeight="semibold" color="fg" truncate>
          {nome}
        </Text>
        <Text
          w="fit-content"
          px={2.5}
          py={0.5}
          rounded="full"
          bg="bg.muted"
          fontSize="xs"
          fontWeight="medium"
          color="fg.muted"
          truncate
        >
          {funcao}
        </Text>
      </Stack>

      {url && (
        <Link
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          justifyContent="center"
          flexShrink={0}
          boxSize={10}
          borderWidth="1px"
          borderColor="border"
          rounded="full"
          color="fg.muted"
        >
          <RiArrowRightUpLine />
        </Link>
      )}
    </Flex>
  )
}
