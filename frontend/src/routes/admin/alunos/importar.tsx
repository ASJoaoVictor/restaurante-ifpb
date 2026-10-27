import { ImportarAlunosForm } from '@/components/forms/importar-alunos'
import { Wrapper } from '@/components/layout/wrapper'
import { checkRole } from '@/utils/auth-helpers'
import { Box, Button, Collapsible, Grid, GridItem, Heading, List, Table, Text } from '@chakra-ui/react'
import { createFileRoute } from '@tanstack/react-router'
import { RiArrowDropDownLine } from 'react-icons/ri'

export const Route = createFileRoute('/admin/alunos/importar')({
  component: RouteComponent,
  head: () => ({ meta: [{ title: 'Importar alunos do SUAP | IFPB Meals' }] }),
  beforeLoad: ({ context }) => {
    checkRole(context, ['admin'])
  }
})

function RouteComponent() {
  return (
    <Wrapper title="Importar alunos do SUAP">
      <Grid
        templateColumns={{ base: '1fr', md: '1fr 1fr', lg: '3fr 4fr' }}
        gap={12}
        alignItems="start"
        w="full"
        maxW="100%"
        overflow="hidden"
      >
        <GridItem minW={0}>
          <ImportarAlunosForm />
        </GridItem>

        <GridItem minW={0}>
          <Text>
            Para importar alunos, acesse o SUAP e exporte a lista de alunos em formato XLS contendo obrigatoriamente os
            seguintes dados:
          </Text>

          <List.Root mt={4} textStyle="sm" listStylePosition="inside">
            {/* <List.Item>Tipo de Deficiência</List.Item> */}
            <List.Item>Matrícula</List.Item>
            <List.Item>Nome</List.Item>
            <List.Item>Curso</List.Item>
            <List.Item>Situação</List.Item>
            <List.Item>Situação no último período</List.Item>
            <List.Item>Cidade do endereço</List.Item>
            <List.Item>E-mail acadêmico</List.Item>
            {/* <List.Item>Faixa de renda (SISTEC)</List.Item> */}
            {/* <List.Item>IVS válido</List.Item> */}
            <List.Item>Período atual</List.Item>
            <List.Item>Telefone</List.Item>
            <List.Item>Turma do último período</List.Item>
          </List.Root>

          <Text textStyle="xs" mt={4}>
            Observação: Os nomes das colunas devem ser EXATAMENTE como os nomes acima
          </Text>

          <Collapsible.Root unmountOnExit>
            <Collapsible.Trigger paddingY="3" as="div">
              <Button variant="ghost">
                Ver exemplo <RiArrowDropDownLine />
              </Button>
            </Collapsible.Trigger>
            <Collapsible.Content>
              <Heading mb={4}>Exemplo de planilha</Heading>
              <SheetExample />
            </Collapsible.Content>
          </Collapsible.Root>
        </GridItem>
      </Grid>
    </Wrapper>
  )
}

const ALUNOS_EXEMPLO = [
  {
    matricula: '202510000001',
    nome: 'José da Silva',
    curso: '353 - Técnico em Informática Integrado - Picuí (CAMPUS PICUÍ)',
    situacao: 'Matriculado',
    situacaoUltimoPeriodo: 'Matriculado',
    cidadeEndereco: 'Picuí - PB',
    emailAcademico: 'jose.silva@academico.ifpb.edu.br',
    periodoAtual: 1,
    telefone: '(11) 99999-9999',
    turmaUltimoPeriodo:
      '20251.3.353.1D, Curso Técnico em Informática Integrado ao Ensino Médio, Matriz 230, 1º Período, Diurno'
  },
  {
    matricula: '202510000002',
    nome: 'Maria Oliveira',
    curso: '353 - Técnico em Informática Integrado - Picuí (CAMPUS PICUÍ)',
    situacao: 'Matriculado',
    situacaoUltimoPeriodo: 'Matriculado',
    cidadeEndereco: 'Picuí - PB',
    emailAcademico: 'maria.oliveira@academico.ifpb.edu.br',
    periodoAtual: 1,
    telefone: '(11) 98888-8888',
    turmaUltimoPeriodo:
      '20251.3.353.1D, Curso Técnico em Informática Integrado ao Ensino Médio, Matriz 230, 1º Período, Diurno'
  },
  {
    matricula: '202510000003',
    nome: 'Carlos Pereira',
    curso: '353 - Técnico em Informática Integrado - Picuí (CAMPUS PICUÍ)',
    situacao: 'Matriculado',
    situacaoUltimoPeriodo: 'Matriculado',
    cidadeEndereco: 'Picuí - PB',
    emailAcademico: 'carlos.pereira@academico.ifpb.edu.br',
    periodoAtual: 1,
    telefone: '(11) 97777-7777',
    turmaUltimoPeriodo:
      '20251.3.353.1D, Curso Técnico em Informática Integrado ao Ensino Médio, Matriz 230, 1º Período, Diurno'
  }
]

function SheetExample() {
  return (
    <Box overflow="hidden" w="full">
      <Table.ScrollArea borderWidth="1px" w="full">
        <Table.Root size="sm">
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeader whiteSpace="nowrap">#</Table.ColumnHeader>
              <Table.ColumnHeader whiteSpace="nowrap">Matrícula</Table.ColumnHeader>
              <Table.ColumnHeader whiteSpace="nowrap">Nome</Table.ColumnHeader>
              <Table.ColumnHeader whiteSpace="nowrap">Curso</Table.ColumnHeader>
              <Table.ColumnHeader whiteSpace="nowrap">Situação</Table.ColumnHeader>
              <Table.ColumnHeader whiteSpace="nowrap">Situação no último período</Table.ColumnHeader>
              <Table.ColumnHeader whiteSpace="nowrap">Cidade do endereço</Table.ColumnHeader>
              <Table.ColumnHeader whiteSpace="nowrap">E-mail acadêmico</Table.ColumnHeader>
              <Table.ColumnHeader whiteSpace="nowrap">Período atual</Table.ColumnHeader>
              <Table.ColumnHeader whiteSpace="nowrap">Telefone</Table.ColumnHeader>
              <Table.ColumnHeader whiteSpace="nowrap">Turma do último período</Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {ALUNOS_EXEMPLO.map((aluno, index) => (
              <Table.Row key={index}>
                <Table.Cell whiteSpace="nowrap">{index + 1}</Table.Cell>
                <Table.Cell whiteSpace="nowrap">{aluno.matricula}</Table.Cell>
                <Table.Cell whiteSpace="nowrap">{aluno.nome}</Table.Cell>
                <Table.Cell whiteSpace="nowrap">{aluno.curso}</Table.Cell>
                <Table.Cell whiteSpace="nowrap">{aluno.situacao}</Table.Cell>
                <Table.Cell whiteSpace="nowrap">{aluno.situacaoUltimoPeriodo}</Table.Cell>
                <Table.Cell whiteSpace="nowrap">{aluno.cidadeEndereco}</Table.Cell>
                <Table.Cell whiteSpace="nowrap">{aluno.emailAcademico}</Table.Cell>
                <Table.Cell whiteSpace="nowrap">{aluno.periodoAtual}</Table.Cell>
                <Table.Cell whiteSpace="nowrap">{aluno.telefone}</Table.Cell>
                <Table.Cell whiteSpace="nowrap">{aluno.turmaUltimoPeriodo}</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      </Table.ScrollArea>
    </Box>
  )
}
