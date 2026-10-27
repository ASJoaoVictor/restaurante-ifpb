import { Skeleton } from '@/components/ui/skeleton'
import { Box, SimpleGrid, Stack, Wrap } from '@chakra-ui/react'

export function InscricoesSkeleton() {
  return (
    <>
      <Skeleton w="sm" h={30} mb={5} />

      <Stack gap={4}>
        <SimpleGrid columns={{ base: 1, sm: 2, md: 4 }} gap={4}>
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton h={108} key={i} />
          ))}
        </SimpleGrid>

        <Wrap gap={4}>
          <Skeleton w={100} h="40px" />
          <Skeleton w={190} h="40px" />
          <Skeleton w={180} h="40px" />
          <Skeleton w={120} h="40px" />
          <Box flex={{ lg: 1 }} />
          <Skeleton w={140} h="40px" />
          <Skeleton w={140} h="40px" />
          <Skeleton w={180} h="40px" />
        </Wrap>

        <Skeleton h="40px" />

        <Skeleton h="md" />
      </Stack>
    </>
  )
}
