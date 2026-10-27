import { InscricaoPresenca } from '@/api/endpoints/api.schemas'
import { INSCRICAO_PRESENCA_COLOR } from '@/enums/inscricao'
import { Box, Button, ButtonGroup, IconButton } from '@chakra-ui/react'
import { RiCheckLine, RiCloseLine, RiUserUnfollowLine } from 'react-icons/ri'

interface ControlesPresencaProps {
  presenca: InscricaoPresenca
  onAlternarPresenca: (statusAlvo: InscricaoPresenca) => void
  isLoading: boolean
}

export function ControlesPresenca({ presenca, onAlternarPresenca, isLoading }: ControlesPresencaProps) {
  const cor = INSCRICAO_PRESENCA_COLOR[presenca]

  return (
    <>
      {/* Controles mobile */}
      <Box hideFrom="md">
        <ButtonGroup size="sm" variant="surface" attached colorPalette={cor}>
          <IconButton
            variant={presenca === 'desistente' ? 'solid' : 'outline'}
            disabled={isLoading}
            onClick={() => onAlternarPresenca('desistente')}
          >
            <RiUserUnfollowLine />
          </IconButton>
          <IconButton
            variant={presenca === 'ausente' ? 'solid' : 'outline'}
            disabled={isLoading}
            onClick={() => onAlternarPresenca('ausente')}
          >
            <RiCloseLine />
          </IconButton>
          <IconButton
            variant={presenca === 'presente' ? 'solid' : 'outline'}
            disabled={isLoading}
            onClick={() => onAlternarPresenca('presente')}
          >
            <RiCheckLine />
          </IconButton>
        </ButtonGroup>
      </Box>

      {/* Controles desktop */}
      <Box hideBelow="md">
        <ButtonGroup size="sm" variant="surface" attached colorPalette={cor}>
          <Button
            variant={presenca === 'desistente' ? 'solid' : 'outline'}
            disabled={isLoading}
            onClick={() => onAlternarPresenca('desistente')}
          >
            <RiUserUnfollowLine />
            Desistente
          </Button>
          <Button
            variant={presenca === 'ausente' ? 'solid' : 'outline'}
            disabled={isLoading}
            onClick={() => onAlternarPresenca('ausente')}
          >
            <RiCloseLine />
            Ausente
          </Button>
          <Button
            variant={presenca === 'presente' ? 'solid' : 'outline'}
            disabled={isLoading}
            onClick={() => onAlternarPresenca('presente')}
          >
            <RiCheckLine />
            Presente
          </Button>
        </ButtonGroup>
      </Box>
    </>
  )
}
