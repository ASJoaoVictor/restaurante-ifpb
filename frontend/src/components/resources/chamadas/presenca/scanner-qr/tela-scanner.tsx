import { ChamadaPresencaDto } from '@/api/endpoints/api.schemas'
import { DrawerBackdrop, DrawerContent, DrawerRoot } from '@/components/ui/drawer'
import { Switch } from '@/components/ui/switch'
import { useBackButtonClosableModal } from '@/hooks/use-back-button-closable-modal'
import { Badge, Box, Button, Flex } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { RiArrowDropUpLine } from 'react-icons/ri'
import useLocalStorageState from 'use-local-storage-state'
import { FilaQR } from '../fila-qr'
import { ScannerCamera } from './scanner-camera'

interface TelaScannerProps {
  chamada: ChamadaPresencaDto
}

export function TelaScanner({ chamada }: TelaScannerProps) {
  const { open, onOpenChange, setOpen } = useBackButtonClosableModal('filaQRCode')
  const [filaAlunos, setFilaAlunos] = useState(new Set<string>())
  const [presencaAutomatica, setPresencaAutomatica] = useLocalStorageState('qrcode.presencaAutomatica', {
    defaultValue: false
  })

  const handleEscanearAluno = (alunoId: string) => {
    setFilaAlunos((prev) => {
      const novaFila = new Set(prev)
      novaFila.add(alunoId)
      return novaFila
    })
    setOpen(true)
  }

  useEffect(() => {
    if (filaAlunos.size === 0) {
      setOpen(false)
    }
  }, [filaAlunos, setOpen])

  return (
    <Box h="100vh" bgColor="black">
      <ScannerCamera chamada={chamada} onEscanearAluno={handleEscanearAluno} />

      <Flex
        position="absolute"
        h={32}
        bottom={0}
        left={0}
        width="full"
        p={2}
        bgGradient="to-t"
        gradientFrom="blackAlpha.900"
        gradientTo="transparent"
        align="flex-end"
        className="dark"
      >
        <Flex gap={2}>
          <Switch
            color="fg"
            my={2.5}
            size="lg"
            checked={presencaAutomatica}
            onCheckedChange={(e) => setPresencaAutomatica(e.checked)}
          >
            Presença automática
          </Switch>
        </Flex>

        <Box flex={1} />

        <Flex gap={2}>
          <Button
            variant="ghost"
            colorPalette="gray"
            size="lg"
            onClick={() => setOpen(true)}
            disabled={filaAlunos.size === 0}
          >
            <RiArrowDropUpLine />
            Alunos
            <Badge>{filaAlunos.size}</Badge>
          </Button>
        </Flex>
      </Flex>

      <DrawerRoot placement="bottom" open={open} onOpenChange={onOpenChange}>
        <DrawerBackdrop />
        <DrawerContent
          maxW="md"
          mx="auto"
          offset={{ base: 0, md: 4 }}
          rounded="md"
          roundedBottom={{ base: 0, md: 'md' }}
          overflow="hidden"
          maxH="sm"
          portalled={false}
        >
          <FilaQR chamada={chamada} fila={filaAlunos} setFila={setFilaAlunos} />
        </DrawerContent>
      </DrawerRoot>
    </Box>
  )
}
