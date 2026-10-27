import icon from '@/assets/img/icon.svg'
import { Box, Flex, Heading, Image } from '@chakra-ui/react'

export function Logo() {
  return (
    <Flex gap={4} align="center">
      <Image src={icon} alt="Ícone" h={12} />
      <Box lineHeight="shorter">
        <Heading fontWeight="extrabold">IFPB Meals</Heading>
        <Box color="fg.muted" fontSize="xs">
          Restaurante Estudantil
        </Box>
      </Box>
    </Flex>
  )
}
