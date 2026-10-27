import { SkeletonCircle, Skeleton } from '@/components/ui/skeleton'
import { Box, Flex, Heading, Text } from '@chakra-ui/react'
import { AcoesFila } from './acoes-fila'

export function ItemAlunoFilaSkeleton() {
  return (
    <Box>
      <Flex gap={4}>
        <SkeletonCircle size={10} />
        <Skeleton flex={1}>
          <Heading textStyle="md" lineHeight="short">
            &nbsp;
          </Heading>
          <Text textStyle="sm" lineHeight="short" color="fg.muted">
            &nbsp;
          </Text>
        </Skeleton>
      </Flex>
      <Skeleton w="fit-content" ml="auto" mt={2}>
        <AcoesFila
          temInscricao
          inscricaoValida
          jaPresente={false}
          isLoading={false}
          onMarcarPresente={() => {}}
          onIncluirAluno={() => {}}
        />
      </Skeleton>
    </Box>
  )
}
