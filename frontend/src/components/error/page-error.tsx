import { authLogout } from '@/api/endpoints/authentication'
import { Button, Clipboard, Container, Heading, Link, List, Text, Wrap } from '@chakra-ui/react'
import { ErrorComponentProps } from '@tanstack/react-router'
import { useEffect } from 'react'
import { BiLogoGmail } from 'react-icons/bi'
import { MdEmail } from 'react-icons/md'
import { RiAlertLine } from 'react-icons/ri'
import { reportError } from './report-error'

export function PageError({ error, reset }: ErrorComponentProps) {
  const reportContent = getReportContent(error, window.location.href)
  const email = import.meta.env.VITE_REPORT_EMAIL
  const subject = 'Relatório de Erros - Restaurante IFPB'
  const body = reportContent

  const mailToURL = getMailToURL(email, subject, body)
  const gmailURL = getGmailURL(email, subject, body)

  useEffect(() => {
    void reportError(error, 'frontend-crash')
  }, [error])

  return (
    <Container maxW="6xl" py={8}>
      <RiAlertLine size={72} />

      <Heading fontWeight={200} my={4}>
        Ops! Encontramos um problema ao carregar esta página
      </Heading>

      <Text mb={4}>
        Ajude-nos a melhorar a sua experiência! Reporte o erro e nossa equipe de desenvolvedores irá solucioná-lo o mais
        rápido possível.
      </Text>

      <Wrap gap={2} mb={4}>
        <Button asChild colorPalette="red" hidden={!email}>
          <Link href={gmailURL} target="_blank" textDecoration="none">
            <BiLogoGmail size={24} />
            Reportar erro pelo Gmail
          </Link>
        </Button>

        <Button asChild colorPalette="orange" variant="outline" hidden={!email}>
          <Link href={mailToURL} target="_blank" textDecoration="none">
            <MdEmail size={24} />
            Reportar por e-mail
          </Link>
        </Button>

        <Clipboard.Root value={reportContent}>
          <Clipboard.Trigger asChild>
            <Button variant="surface" size="sm">
              <Clipboard.Indicator />
              Copiar relatório de erro
            </Button>
          </Clipboard.Trigger>
        </Clipboard.Root>
      </Wrap>

      <Text as="em">Agradecemos a sua colaboração</Text>

      <Heading fontSize="lg" mt={8} mb={2}>
        Enquanto isso, você pode tentar as seguintes opções:
      </Heading>

      <List.Root>
        <List.Item>
          <Link onClick={() => reset()}>Tentar renderizar a página novamente</Link>
        </List.Item>
        <List.Item>Recarregar a página</List.Item>
        <List.Item>Voltar para a página anterior</List.Item>
        <List.Item>
          Tente <Link onClick={() => authLogout()}>sair</Link> e <Link href="/login">logar</Link> novamente na sua conta
        </List.Item>
        <List.Item>
          <Link onClick={() => localStorage.clear()}>Limpar os dados</Link> do site e recarregar a página
        </List.Item>
      </List.Root>
    </Container>
  )
}

function getMailToURL(email: string, subject: string, body: string) {
  subject = encodeURIComponent(subject)
  body = encodeURIComponent(body)
  email = encodeURIComponent(email)
  return `mailto:${email}?subject=${subject}&body=${body}`
}

function getGmailURL(email: string, subject: string, body: string) {
  subject = encodeURIComponent(subject)
  body = encodeURIComponent(body)
  email = encodeURIComponent(email)
  return `https://mail.google.com/mail/?view=cm&fs=1&to=${email}&su=${subject}&body=${body}`
}

function getReportContent(error: any, url: string) {
  let text = `• Descrição (opcional):\n[Por favor, informe a ação que causou o erro]\n🡒 \n\n`
  text += `• Data/hora:\n${new Date().toLocaleString('pt-BR')}\n\n`
  text += `• URL:\n${url}\n\n`
  text += `• Stack:\n${error?.stack}\n\n`
  return text
}
