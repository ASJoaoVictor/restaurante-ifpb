import { Link } from '@chakra-ui/react'
import { Tooltip } from '../ui/tooltip'

export function UsuarioEmailDisplay({ usuario }: { usuario: { email: string } }) {
  return (
    <Tooltip content="Enviar e-mail" positioning={{ placement: 'top' }}>
      <Link target="_blank" href={`mailto:${usuario.email}`}>
        {usuario.email}
      </Link>
    </Tooltip>
  )
}
