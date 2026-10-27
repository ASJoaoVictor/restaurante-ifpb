import { Badge, Box, Heading, HStack, Text } from '@chakra-ui/react'

interface BadgeAlunoLabelProps<T = string> {
  label: string
  items?: T[]
  fallbackMessage?: string
  formatItem?: (item: T) => string
}

export function BadgeAlunoLabel<T = string>({
  label,
  items = [],
  fallbackMessage = 'Nenhum item encontrado',
  formatItem = String
}: BadgeAlunoLabelProps<T>) {
  return (
    <Box gap={2}>
      <Heading as="h3" textStyle="sm" fontSize="lg" fontWeight="medium">
        {label}
      </Heading>

      {items.length > 0 ? (
        <HStack gap={1} flexWrap="wrap">
          {items.map((item, idx) => (
            <Badge key={idx}>{formatItem(item)}</Badge>
          ))}
        </HStack>
      ) : (
        <Text fontSize="lg" color="fg.subtle">
          {fallbackMessage}
        </Text>
      )}
    </Box>
  )
}
