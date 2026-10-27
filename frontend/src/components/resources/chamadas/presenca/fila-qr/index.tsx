import { ChamadaPresencaDto } from '@/api/endpoints/api.schemas'
import { Stack } from '@chakra-ui/react'
import { AnimatePresence, motion } from 'framer-motion'
import { Dispatch, SetStateAction } from 'react'
import { ItemAlunoFila } from './item-aluno-fila'

interface FilaQRProps {
  fila: Set<string>
  setFila: Dispatch<SetStateAction<Set<string>>>
  chamada: ChamadaPresencaDto
}

export function FilaQR({ fila, setFila, chamada }: FilaQRProps) {
  const handleRemover = (alunoId: string) => {
    const novaFila = new Set(fila)
    novaFila.delete(alunoId)
    setFila(novaFila)
  }

  return (
    <Stack
      overflow="auto"
      px={4}
      py={fila.size === 0 ? 0 : 4}
      transition="padding 0.3s ease"
      style={{ gap: 'var(--chakra-spacing-4)' }}
    >
      <AnimatePresence>
        {Array.from(fila).map((alunoId) => (
          <motion.div
            key={alunoId}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{ overflow: 'hidden' }}
          >
            <ItemAlunoFila alunoId={alunoId} onRemover={handleRemover} chamada={chamada} />
          </motion.div>
        ))}
      </AnimatePresence>
    </Stack>
  )
}
