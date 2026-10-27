import { internalReportError } from '@/api/endpoints/internal'
import { toaster } from '../ui/toaster'

export type ErrorReportType = 'frontend-crash' | 'unhandled-browser-error' | 'manual-report' | 'frontend-assertion'

const LOOP_THRESHOLD = 10
const LOOP_WINDOW = 5000
let firstErrorTime = 0
let errorCount = 0

export function reportError(error: unknown, type: ErrorReportType) {
  if (import.meta.env.DEV) return null

  // Evita loops de reportação de erros
  const now = Date.now()
  if (now - firstErrorTime < LOOP_WINDOW) {
    errorCount++
    if (errorCount > LOOP_THRESHOLD) return null
  } else {
    firstErrorTime = now
    errorCount = 1
  }

  return _reportError(error, type)
}

async function _reportError(error: unknown, type: ErrorReportType, details?: string) {
  return internalReportError({
    name: (error as Error)?.name || null,
    message: (error as Error)?.message || String(error),
    stack: (error as Error)?.stack || null,
    details: details || null,
    type,
    url: window.location.href
  })
}

export function manualReportError(error: unknown) {
  return () => {
    toaster.promise(_reportError(error, 'manual-report'), {
      loading: {
        title: 'Reportando erro',
        description: 'Estamos enviando o erro para nossa equipe'
      },
      success: {
        title: 'Erro reportado',
        description: 'Obrigado por reportar o erro. Sua ajuda é muito importante para nós'
      },
      error(arg) {
        return {
          title: 'Erro ao reportar',
          description: 'Ocorreu um erro ao tentar reportar o problema',
          action: {
            label: 'Tentar novamente',
            onClick: manualReportError(error)
          }
        }
      }
    })
  }
}
