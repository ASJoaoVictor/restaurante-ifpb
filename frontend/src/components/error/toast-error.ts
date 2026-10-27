import { toaster as chakraToaster } from '../ui/toaster'
import { getError, ToasterOptions } from './get-error'
import { manualReportError } from './report-error'

export interface ToastErrorOptions extends Partial<ToasterOptions> {
  reportable?: boolean
  toaster?: typeof chakraToaster
}

export function toastError(error: unknown, options: ToastErrorOptions = {}) {
  const { reportable = false, toaster = chakraToaster, ...toastOptions } = options
  const toastId = Math.random().toString(36).substring(2, 15)

  if (reportable) {
    toastOptions.action ??= {
      label: 'Reportar erro',
      onClick: manualReportError(error)
    }
  }

  toaster.error({
    id: toastId,
    duration: 5000,
    closable: true,
    ...getError(error),
    ...toastOptions
  })

  return { toastId }
}
