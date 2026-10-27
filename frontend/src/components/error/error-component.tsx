import { Button, EmptyState, HStack, VStack } from '@chakra-ui/react'
import { useState } from 'react'
import { RiAlertLine } from 'react-icons/ri'
import { getError } from './get-error'
import { manualReportError } from './report-error'

interface ErrorComponentProps {
  error: unknown
  title?: string
  retry?: () => void
  reportable?: boolean
}

export function ErrorComponent({ error, title: customTitle, retry, reportable }: ErrorComponentProps) {
  const [isReporting, setIsReporting] = useState(false)

  if (!error) return null

  const { title, description } = getError(error)

  const handleReportError = async () => {
    setIsReporting(true)
    manualReportError(error)()
  }

  return (
    <EmptyState.Root>
      <EmptyState.Content>
        <EmptyState.Indicator>
          <RiAlertLine />
        </EmptyState.Indicator>

        <VStack textAlign="center">
          <EmptyState.Title>{title || customTitle || 'Algo deu errado'}</EmptyState.Title>

          <EmptyState.Description whiteSpace="pre-line">{description}</EmptyState.Description>

          <HStack gap={4} mt={4} hidden={!retry && (!reportable || isReporting)}>
            <Button variant="outline" colorPalette="gray" onClick={retry} hidden={!retry}>
              Tentar Novamente
            </Button>

            <Button
              variant="outline"
              colorPalette="gray"
              onClick={handleReportError}
              hidden={!reportable || isReporting}
            >
              Reportar Erro
            </Button>
          </HStack>
        </VStack>
      </EmptyState.Content>
    </EmptyState.Root>
  )
}
