import {
  CardDescription,
  CardFooter,
  CardHeader,
  CardRoot,
  CardTitle,
  For,
  SimpleGrid,
  HStack,
  Tokens
} from '@chakra-ui/react'
import { IconType } from 'react-icons'
import { RiUserFill } from 'react-icons/ri'

interface VisaoGeralProps {
  title?: string
  icon: IconType
  description?: string
  total?: number
  color: Tokens['colors']
}

const config: VisaoGeralProps[] = [
  {
    title: 'Total de Alunos',
    icon: RiUserFill,
    description: 'Número total de alunos.',
    total: 150,
    color: 'blue.500'
  },
  {
    title: 'Cancelamentos',
    icon: RiUserFill,
    total: 12,
    description: 'Número de cancelamentos de refeições.',
    color: 'red.500'
  },
  {
    title: 'Refeições Hoje',
    icon: RiUserFill,
    total: 50,
    description: 'Total de refeições servidas hoje.',
    color: 'green.500'
  }
]

export function VisaoGeral() {
  return (
    <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={4}>
      <For each={config}>
        {(item, index) => (
          <CardRoot key={index} rounded="md" borderInlineStartWidth={5} borderInlineStartColor={item.color}>
            <CardHeader>
              <CardTitle asChild>
                <HStack justify="space-between">
                  {item.title}
                  <item.icon size={22} />
                </HStack>
              </CardTitle>
              <CardDescription fontSize="2xl">{item.total}</CardDescription>
            </CardHeader>
            <CardFooter>{item.description}</CardFooter>
          </CardRoot>
        )}
      </For>
    </SimpleGrid>
  )
}
