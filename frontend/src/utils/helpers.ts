/**
 * Pausa a execução por um determinado período de tempo
 * @param ms Tempo em milissegundos
 * @returns Uma promessa que é resolvida após o tempo especificado
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
