import { AxiosError } from 'axios'
import { getAxiosError } from './axios-error'
import { toaster } from '../ui/toaster'

export type ToasterOptions = Parameters<typeof toaster.create>[0]

export function getError(error: unknown): ToasterOptions {
  if (error instanceof AxiosError) {
    return getAxiosError(error)
  }

  if (error instanceof Error) {
    return {
      title: 'Erro',
      description: error.message || 'Ocorreu um erro desconhecido'
    }
  }

  return {
    title: 'Erro',
    description: error
  }
}
