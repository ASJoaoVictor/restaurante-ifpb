import { Box, CardRoot, Skeleton, Stack } from '@chakra-ui/react'

export function ChamadasLoading() {
  return (
    <Stack gap={3}>
      {Array.from({ length: 4 }).map((_, index) => (
        <CardRoot p={4} key={index}>
          <Stack
            gap={6}
            direction={{ base: 'column', md: 'row' }}
            justify="space-between"
            align={{ base: 'start', md: 'center' }}
          >
            <Box flex={1}>
              <Skeleton h={5} w="70%" mb={2} />
              <Skeleton h={4} w="40%" />
            </Box>

            <Skeleton h={6} w={100} borderRadius="lg" />
          </Stack>

          <Stack mt={3} gap={3}>
            <Stack
              direction={{ base: 'column', md: 'row' }}
              justify="space-between"
              align={{ base: 'start', md: 'center' }}
              gap={4}
            >
              <Skeleton h={4} w="50px" />

              <Box flex={1}>
                <Skeleton h={3} w="100%" />
              </Box>

              <Skeleton h={4} w="80px" />
            </Stack>
          </Stack>
        </CardRoot>
      ))}
    </Stack>
  )
}
