import { Link } from '@chakra-ui/react'
import { Tooltip } from '../ui/tooltip'
import parsePhoneNumber from 'libphonenumber-js'

export function UsuarioTelefoneDisplay({ usuario }: { usuario: { phone?: string | null } }) {
  if (!usuario.phone) return null

  const parsedPhoneNumber = parsePhoneNumber(usuario.phone || '', 'BR')
  const whatsappLink = parsedPhoneNumber && `https://wa.me/${parsedPhoneNumber.number.slice(1)}`

  if (whatsappLink) {
    return (
      <Tooltip content="Abrir WhatsApp" positioning={{ placement: 'top' }}>
        <Link target="_blank" href={whatsappLink} hidden={!whatsappLink}>
          {usuario.phone}
        </Link>
      </Tooltip>
    )
  }

  return (
    <Tooltip content="Ligar" positioning={{ placement: 'top' }}>
      <Link target="_blank" href={`tel:${usuario.phone}`} hidden={!!whatsappLink}>
        {usuario.phone}
      </Link>
    </Tooltip>
  )
}
