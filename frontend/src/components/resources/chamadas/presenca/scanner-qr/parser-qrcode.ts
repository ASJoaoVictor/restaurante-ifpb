import { z } from 'zod'

export function analisarQRCodeAluno(qrCodeBruto: string) {
  let analisado: object
  try {
    analisado = JSON.parse(qrCodeBruto)
  } catch (error) {
    throw new Error('JSON inválido')
  }

  const [versao, alunoId, assinatura] = z
    .tuple([z.number().int().min(1), z.string().uuid(), z.string()])
    .parse(analisado)

  return { versao, alunoId, assinatura }
}

export type DadosQRCodeAluno = ReturnType<typeof analisarQRCodeAluno>

export async function checkQRCodeSignature(message: string, signature: string, publicKey: string) {
  if (!publicKey) return true
  const publicKeyBytes = Uint8Array.from(atob(publicKey), (c) => c.charCodeAt(0))
  const signatureBytes = Uint8Array.from(atob(signature), (c) => c.charCodeAt(0))
  const messageBytes = new TextEncoder().encode(message)
  const cryptoKey = await crypto.subtle.importKey('spki', publicKeyBytes, { name: 'Ed25519' }, true, ['verify'])
  const valid = await crypto.subtle.verify('Ed25519', cryptoKey, signatureBytes, messageBytes)
  return valid
}
