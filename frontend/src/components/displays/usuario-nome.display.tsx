import { User } from '@/api/endpoints/api.schemas'
import { Box, HStack } from '@chakra-ui/react'
import { Clipboard } from '../resources/alunos/clipboard'
import { UsuarioFoto } from '../resources/usuarios/foto'

export function UsuarioNomeDisplay({ usuario }: { usuario: User }) {
  return (
    <HStack gap={2}>
      <UsuarioFoto usuario={usuario} />
      <Box fontWeight="medium">
        <Clipboard text={usuario.name} />
      </Box>
    </HStack>
  )
}
