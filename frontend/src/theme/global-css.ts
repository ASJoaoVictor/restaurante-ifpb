import { defineGlobalStyles } from '@chakra-ui/react'
import { colorPalette } from './colors'

export const globalCss = defineGlobalStyles({
  html: { colorPalette },
  body: { bg: 'gray.50', color: 'gray.800' }
})
