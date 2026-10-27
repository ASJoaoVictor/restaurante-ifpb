import { toaster } from '@/components/ui/toaster'
import { Tooltip } from '@/components/ui/tooltip'
import { Text, useClipboard } from '@chakra-ui/react'

export function Clipboard({ text }: { text: string }) {
  const { copy } = useClipboard({
    value: String(text),
    onStatusChange: (status) => {
      if (status.copied) {
        toaster.success({
          title: 'Copiado para a área de transferência'
        })
      }
    }
  })

  return (
    <Tooltip content="Clique para copiar" positioning={{ placement: 'top' }}>
      <Text as="span" onClick={copy} cursor="pointer" userSelect="all">
        {text}
      </Text>
    </Tooltip>
  )
}
