import { Box, Flex, SimpleGrid, Stack } from '@chakra-ui/react'
import { Skeleton, SkeletonCircle } from '../../ui/skeleton'

export function HomeLoading() {
  return (
    <Stack gap={10}>
      {Array.from({ length: 3 }).map((_, index) => (
        <Box as="section" key={index}>
          <Flex gap={4} align="center" mb={4}>
            <SkeletonCircle w={10} h={10} />
            <Skeleton h={43} flex={1} />
          </Flex>

          <SimpleGrid gap={4} columns={{ base: 1, md: 2, lg: 3 }}>
            {Array.from({ length: 2 }).map((_, index) => (
              <Skeleton key={index} h={300} />
            ))}
          </SimpleGrid>
        </Box>
      ))}
    </Stack>
  )
}
