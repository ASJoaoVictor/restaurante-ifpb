import { Box, Heading, Text } from '@chakra-ui/react'

interface InfoItemProps {
  label: string
  value: React.ReactNode
}

export function InfoItem({ label, value }: InfoItemProps) {
  return (
    <Box gap={2}>
      <Heading as="h3" textStyle="sm" fontSize="lg" fontWeight="medium">
        {label}
      </Heading>
      <Text textStyle="md" color="fg.muted">
        {value}
      </Text>
    </Box>
  )
}
