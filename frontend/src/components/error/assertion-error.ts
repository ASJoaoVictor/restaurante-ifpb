import { reportError } from './report-error'

/**
 * Verifica uma condição e lança um erro se a condição for falsa
 * @param condition A condição a ser verificada
 * @param message A mensagem de erro a ser lançada se a condição for falsa
 * @throws {Error} Se a condição for falsa
 */
export function assert(condition: any, message: string): asserts condition {
  const isDev = import.meta.env.DEV

  if (condition) return

  // Se estiver no modo de desenvolvimento lança um erro, caso contrário reporta o erro
  if (isDev) {
    throw new AssertionError(message)
  } else {
    void reportError(new AssertionError(message), 'frontend-assertion')
  }
}

export class AssertionError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'AssertionError'
  }
}
