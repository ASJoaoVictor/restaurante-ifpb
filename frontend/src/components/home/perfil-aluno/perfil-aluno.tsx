import { UsuarioFoto } from '@/components/resources/usuarios/foto'
import { useAuth } from '@/contexts/auth'
import { formatDia, formatTurma, getNome } from '@/utils/formatters'
import {
  Box,
  CardBody,
  CardDescription,
  CardHeader,
  CardRoot,
  CardTitle,
  Heading,
  SimpleGrid,
  Span,
  Stack,
  Tabs,
  Text
} from '@chakra-ui/react'
import { RiCheckboxCircleLine, RiGraduationCapLine, RiNotificationLine, RiUserLine } from 'react-icons/ri'
import { AlunoFaltas } from '../aluno/aluno-faltas'
import { BadgeAlunoLabel } from './badge-aluno'
import { FaltasAluno } from './faltas-aluno'
import { InfoItem } from './info-item'
import { Notificacoes } from './notificacoes'

export function PerfilAluno() {
  const { me } = useAuth()

  return (
    <Stack>
      <Box mb={8}>
        <Stack direction={{ base: 'column', md: 'row' }} justifyContent="space-between" gap={6}>
          <Stack flex={1} gap={6} direction={{ base: 'column', md: 'row' }} align="center">
            <UsuarioFoto usuario={me.user!} w={{ base: 24, md: 32 }} h={{ base: 24, md: 32 }} />

            <Stack gap={1} textAlign={{ base: 'center', md: 'left' }}>
              <Heading fontWeight="medium" fontSize="3xl" mb={2}>
                {getNome(me.user?.name)}
              </Heading>

              <Text color="fg.muted" textStyle="lg">
                Matrícula: <Span color="fg.subtle"> {me.aluno?.matricula}</Span>
              </Text>

              <Text color="fg.muted" textStyle="lg">
                {me.turma && me.curso && formatTurma(me.turma, me.curso)}
              </Text>
            </Stack>
          </Stack>
        </Stack>
      </Box>

      <AlunoFaltas />

      <Tabs.Root size="lg" defaultValue="geral">
        <Tabs.List overflow="auto" overflowY="hidden" flexShrink={0}>
          <Tabs.Trigger value="geral" flexShrink={0}>
            <RiUserLine />
            Geral
          </Tabs.Trigger>
          <Tabs.Trigger value="curso" flexShrink={0}>
            <RiGraduationCapLine />
            Curso
          </Tabs.Trigger>
          <Tabs.Trigger value="frequencia" flexShrink={0}>
            <RiCheckboxCircleLine />
            Frequência e Contraturno
          </Tabs.Trigger>
          <Tabs.Trigger value="notificacoes" flexShrink={0}>
            <RiNotificationLine />
            Notificações
          </Tabs.Trigger>
        </Tabs.List>

        <Tabs.Content value="geral">
          <CardRoot>
            <CardHeader gap={0}>
              <CardTitle as="h2" textStyle="2xl">
                Informações Pessoais
              </CardTitle>
              <CardDescription>Dados pessoais e de contato do estudante</CardDescription>
            </CardHeader>
            <CardBody>
              <SimpleGrid columns={{ base: 1, md: 2 }} gap={6}>
                <InfoItem label="Nome Completo" value={me.user?.name} />
                <InfoItem label="Matrícula" value={me.aluno?.matricula} />
                <InfoItem label="Email" value={me.user?.email} />
                <InfoItem label="Telefone" value={me.user?.phone} />
              </SimpleGrid>
            </CardBody>
          </CardRoot>
        </Tabs.Content>

        <Tabs.Content value="curso">
          <CardRoot>
            <CardHeader gap={0}>
              <CardTitle as="h2" textStyle="2xl">
                Informações Acadêmicas
              </CardTitle>
              <CardDescription>Curso e turma do estudante</CardDescription>
            </CardHeader>
            <CardBody>
              <SimpleGrid columns={{ base: 1, md: 2 }} gap={8}>
                <InfoItem label="Curso" value={me.curso?.nome} />
                <InfoItem label="Matriz" value={me.curso?.numeroCurso} />
                <InfoItem label="Turma" value={me.turma?.turma} />
                <InfoItem label="Período" value={me.turma?.periodo} />
              </SimpleGrid>
            </CardBody>
          </CardRoot>
        </Tabs.Content>

        <Tabs.Content value="frequencia">
          <CardRoot>
            <CardHeader gap={0}>
              <CardTitle as="h2" textStyle="2xl">
                Frequência
              </CardTitle>
              <CardDescription>Controle de faltas e presença</CardDescription>
            </CardHeader>
            <CardBody>
              <SimpleGrid columns={{ base: 1, md: 2 }} gap={8}>
                <BadgeAlunoLabel
                  label="Dias de Contraturno"
                  items={me.turma?.diasContraturno}
                  fallbackMessage="Sua turma não tem Contraturno"
                  formatItem={(dia) => formatDia(dia)}
                />

                <FaltasAluno auth={me} />
              </SimpleGrid>
            </CardBody>
          </CardRoot>
        </Tabs.Content>

        <Tabs.Content value="notificacoes">
          <CardRoot>
            <CardHeader gap={0}>
              <CardTitle as="h2" textStyle="2xl">
                Notificações
              </CardTitle>
              <CardDescription>Selecione quais notificações receber</CardDescription>
            </CardHeader>
            <CardBody>
              <Notificacoes />
            </CardBody>
          </CardRoot>
        </Tabs.Content>
      </Tabs.Root>
    </Stack>
  )
}
