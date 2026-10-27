import { Box, Dialog, Flex, IconButton } from '@chakra-ui/react'
import { RiCloseLine, RiFullscreenLine, RiLightbulbLine } from 'react-icons/ri'

interface ControlesScannerProps {
  lanterna: boolean
  onAlternarLanterna: () => void
}

export function ControlesScanner({ lanterna, onAlternarLanterna }: ControlesScannerProps) {
  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      void document.documentElement.requestFullscreen()
    } else {
      void document.exitFullscreen()
    }
  }

  return (
    <Flex
      position="absolute"
      h={32}
      top={0}
      left={0}
      width="full"
      p={2}
      bgGradient="to-b"
      gradientFrom="blackAlpha.900"
      gradientTo="transparent"
      align="flex-start"
      className="dark"
    >
      <Flex gap={2}>
        <Dialog.CloseTrigger asChild position="static">
          <IconButton size="lg" variant="ghost" colorPalette="gray">
            <RiCloseLine />
          </IconButton>
        </Dialog.CloseTrigger>
      </Flex>

      <Box flex={1} />

      <Flex gap={2}>
        <IconButton size="lg" variant={lanterna ? 'solid' : 'ghost'} onClick={onAlternarLanterna} colorPalette="gray">
          <RiLightbulbLine />
        </IconButton>

        <IconButton size="lg" variant="ghost" onClick={handleToggleFullscreen} colorPalette="gray">
          <RiFullscreenLine />
        </IconButton>
      </Flex>
    </Flex>
  )
}
