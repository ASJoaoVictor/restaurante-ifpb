import { defineRecipe } from '@chakra-ui/react'

export const buttonRecipe = defineRecipe({
  variants: {
    size: {
      // '2xs': { px: '1' },
      // xs: { px: '1.5' },
      // sm: { px: '1.5' },
      // md: { px: '2' },
      // lg: { px: '2' },
      // xl: { px: '3' },
      // '2xl': { px: '5' }
    },

    variant: {
      solid: {
        _active: {
          bg: 'colorPalette.solid/80'
        }
      },

      ghost: {
        _hover: {
          _dark: {
            bg: 'colorPalette.300/10'
          }
        },
        _active: {
          bg: 'colorPalette.300',
          _dark: {
            bg: 'colorPalette.300/20'
          }
        }
      },

      subtle: {
        _active: {
          bg: 'colorPalette.300'
        }
      },

      outline: {
        _hover: {
          bg: 'colorPalette.300/10',
          _dark: {
            bg: 'colorPalette.300/10'
          }
        },
        _active: {
          bg: 'colorPalette.300',
          _dark: {
            bg: 'colorPalette.300/20'
          }
        }
      }
    }
  }
})
