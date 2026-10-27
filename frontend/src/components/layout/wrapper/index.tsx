import { AppBar } from '@/components/layout/appbar'
import { Footer } from '@/components/layout/footer'
import { Container, Heading, Stack, type ContainerProps } from '@chakra-ui/react'
import { PropsWithChildren, ReactNode } from 'react'

interface WrapperProps extends PropsWithChildren, Omit<ContainerProps, 'title'> {
  title?: ReactNode
  subtitle?: ReactNode
}

export function Wrapper({ children, title, subtitle, ...rest }: WrapperProps) {
  return (
    <Stack minH="100vh">
      <AppBar />
      <Container flex="1" maxW="7xl" my={5} {...rest}>
        <Heading textStyle="3xl" mb={subtitle ? 2 : 5} hidden={!title}>
          {title}
        </Heading>
        <Heading textStyle="xl" fontWeight="medium" color="fg.muted" mb={5} hidden={!subtitle}>
          {subtitle}
        </Heading>
        {children}
      </Container>
      <Footer />
    </Stack>
  )
}
