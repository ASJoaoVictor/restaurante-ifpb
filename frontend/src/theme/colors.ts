import { defaultConfig, defineTokens } from '@chakra-ui/react'

export const colorPalette = 'green'

export const colors = defineTokens.colors({ primary: defaultConfig.theme!.tokens!.colors![colorPalette] })
