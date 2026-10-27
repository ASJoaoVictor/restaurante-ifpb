import { InscricaoPresenca } from '@/api/endpoints/api.schemas'
import { ColorPalette } from '@chakra-ui/react'

export const INSCRICAO_PRESENCA_COLOR: Record<InscricaoPresenca, ColorPalette> = {
  pendente: 'gray',
  presente: 'green',
  ausente: 'red',
  desistente: 'orange'
}

export const INSCRICAO_PRESENCA_ORDER: Record<InscricaoPresenca, number> = {
  presente: 0,
  ausente: 1,
  desistente: 2,
  pendente: 3
}
