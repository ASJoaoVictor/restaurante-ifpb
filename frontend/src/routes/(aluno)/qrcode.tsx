import { Wrapper } from '@/components/layout/wrapper'
import { AlunoQRCode } from '@/components/resources/alunos/qrcode'
import { checkRole } from '@/utils/auth-helpers'
import { Text } from '@chakra-ui/react'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(aluno)/qrcode')({
  component: RouteComponent,
  head: () => ({ meta: [{ title: 'Seu QR code | IFPB Meals' }] }),
  beforeLoad: ({ context }) => {
    checkRole(context, ['aluno'])
  }
})

function RouteComponent() {
  return (
    <Wrapper title="Seu QR code">
      <Text color="fg.muted" mb={8}>
        Este é o seu QR Code. Você pode salvar como imagem ou imprimir para usar no restaurante/cantina.
      </Text>

      <AlunoQRCode />
    </Wrapper>
  )
}
