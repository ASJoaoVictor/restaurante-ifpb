import { Body, Container, Head, Html, Preview, Tailwind } from '@react-email/components'
import * as React from 'react'
import EmailFooter from './footer'

interface IProps extends React.PropsWithChildren {
  preview: string
  head?: React.ReactNode
}

const main: React.CSSProperties = {
  fontFamily: 'Roboto, Noto Sans, Open Sans, Arial, sans-serif',
  color: '#333',
  fontSize: '14px'
}

const container: React.CSSProperties = {
  paddingLeft: '12px',
  paddingRight: '12px',
  margin: '0 auto',
  maxWidth: '50em'
}

export default function EmailLayout({ children, preview, head }: IProps) {
  return (
    <Tailwind config={{ darkMode: 'class', separator: '_' }}>
      <Html>
        <Head>{head}</Head>
        <Preview>{preview}</Preview>
        <Body style={main}>
          <Container style={container}>
            {children}
            <EmailFooter />
          </Container>
        </Body>
      </Html>
    </Tailwind>
  )
}
