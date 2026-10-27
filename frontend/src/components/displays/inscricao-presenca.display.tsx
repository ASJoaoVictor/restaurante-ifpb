import { Inscricao } from '@/api/endpoints/api.schemas'
import { Span } from '@chakra-ui/react'
import { Link } from '@tanstack/react-router'
import { memo } from 'react'
import { RiCheckLine, RiCloseLine, RiUserUnfollowLine } from 'react-icons/ri'
import { Tooltip } from '../ui/tooltip'

export const InscricaoPresencaDisplay = memo(InscricaoPresencaDisplayMemo)

function InscricaoPresencaDisplayMemo({ inscricao }: { inscricao: Inscricao }) {
  if (inscricao.presenca === 'presente') {
    return (
      <Tooltip content="Aluno presente" positioning={{ placement: 'top' }}>
        <Link to="/admin/chamadas/$id/presenca" params={{ id: inscricao.chamadaId }}>
          <Span fontSize="2xl" color="green.solid">
            <RiCheckLine />
          </Span>
        </Link>
      </Tooltip>
    )
  }

  if (inscricao.presenca === 'ausente') {
    return (
      <Tooltip content="Aluno ausente" positioning={{ placement: 'top' }}>
        <Link to="/admin/chamadas/$id/presenca" params={{ id: inscricao.chamadaId }}>
          <Span fontSize="2xl" color="red.solid">
            <RiCloseLine />
          </Span>
        </Link>
      </Tooltip>
    )
  }

  if (inscricao.presenca === 'desistente') {
    return (
      <Tooltip content="Aluno desistente" positioning={{ placement: 'top' }}>
        <Link to="/admin/chamadas/$id/presenca" params={{ id: inscricao.chamadaId }}>
          <Span fontSize="2xl" color="orange.solid">
            <RiUserUnfollowLine />
          </Span>
        </Link>
      </Tooltip>
    )
  }

  return null
}
