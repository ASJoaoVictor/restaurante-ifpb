import { User } from '@/api/endpoints/api.schemas'
import { Avatar, AvatarRootProps } from '@chakra-ui/react'

export function UsuarioFoto({ usuario, ...props }: { usuario: Pick<User, 'name' | 'photoUrl'> } & AvatarRootProps) {
  return (
    <Avatar.Root size="xs" {...props}>
      <Avatar.Fallback name={usuario?.name} />
      {usuario?.photoUrl && <Avatar.Image src={usuario?.photoUrl} />}
    </Avatar.Root>
  )
}
