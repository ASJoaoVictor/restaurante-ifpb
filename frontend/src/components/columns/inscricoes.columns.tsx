import { Chamada, InscricaoComAluno } from '@/api/endpoints/api.schemas'
import { INSCRICAO_PRESENCA_ORDER } from '@/enums/inscricao'
import { formatTurma } from '@/utils/formatters'
import { Box, Span } from '@chakra-ui/react'
import { createColumnHelper } from '@tanstack/react-table'
import dayjs from 'dayjs'
import { DefaultHeader } from '../data-table/headers/default-header'
import { InscricaoAcoesDisplay } from '../displays/inscricao-acoes.display'
import { InscricaoAlunoDisplay } from '../displays/inscricao-aluno.display'
import { InscricaoDocumentoDisplay } from '../displays/inscricao-documento.display'
import { InscricaoPresencaDisplay } from '../displays/inscricao-presenca.display'
import { InscricaoStatusDisplay } from '../displays/inscricao-status.display'

const columnHelper = createColumnHelper<InscricaoComAluno>()

export const columnsInscricoes = [
  columnHelper.display({
    id: 'action',
    header: 'Ações',
    cell: ({ row }) => <InscricaoAcoesDisplay inscricaoComAluno={row.original} />
  }),

  columnHelper.accessor('inscricao.status', {
    header: (info) => <DefaultHeader<InscricaoComAluno> info={info} name="Status" />,
    cell: ({ row }) => <InscricaoStatusDisplay inscricao={row.original.inscricao} />,
    sortingFn: (rowA, rowB) => {
      const order = { aceita: 0, rejeitada: 1, lista: 2, pendente: 3 }
      return order[rowA.original.inscricao.status] - order[rowB.original.inscricao.status]
    }
  }),

  columnHelper.accessor('inscricao', {
    id: 'posicao',
    header: (info) => <DefaultHeader<InscricaoComAluno> info={info} name="Pos." tooltip="Posição do aluno na lista" />,
    cell: ({ row }) => <Span textStyle="lg">{row.index + 1}º</Span>,
    sortingFn: (rowA, rowB) => rowA.index - rowB.index
  }),

  columnHelper.accessor('usuario.name', {
    header: (info) => <DefaultHeader<InscricaoComAluno> info={info} name="Aluno" />,
    cell: ({ row, table }) => {
      const meta = table.options.meta! as { chamada: Chamada }
      return <InscricaoAlunoDisplay inscricaoComAluno={row.original} chamada={meta.chamada} />
    }
  }),

  columnHelper.accessor('inscricao.comprovanteContraturnoStatus', {
    header: (info) => (
      <DefaultHeader<InscricaoComAluno> info={info} name="C.T." tooltip="Comprovante de aula em contraturno" />
    ),
    cell: ({ row }) => <InscricaoDocumentoDisplay inscricaoComAluno={row.original} />,
    sortingFn: (rowA, rowB) => {
      const order = { aceito: 0, rejeitado: 1, pendente: 2 }
      if (!rowA.original.inscricao.documentoComprobatorio) return 1
      if (!rowB.original.inscricao.documentoComprobatorio) return -1
      return (
        order[rowA.original.inscricao.comprovanteContraturnoStatus] -
        order[rowB.original.inscricao.comprovanteContraturnoStatus]
      )
    }
  }),

  columnHelper.accessor('inscricao.presenca', {
    header: (info) => <DefaultHeader<InscricaoComAluno> info={info} name="Pres." tooltip="Aluno pegou a refeição" />,
    cell: ({ row }) => <InscricaoPresencaDisplay inscricao={row.original.inscricao} />,
    sortingFn: (rowA, rowB) => {
      return (
        INSCRICAO_PRESENCA_ORDER[rowA.original.inscricao.presenca] -
        INSCRICAO_PRESENCA_ORDER[rowB.original.inscricao.presenca]
      )
    }
  }),

  columnHelper.accessor('inscricao.dataHoraInscricao', {
    header: (info) => <DefaultHeader<InscricaoComAluno> info={info} name="Inscreveu em" />,
    cell: ({ row }) => (
      <>
        <Box>{dayjs(row.original.inscricao.dataHoraInscricao).format('DD [de] MMM, HH:mm')}</Box>
        <Box textStyle="xs" color="fg.muted">
          {dayjs(row.original.inscricao.dataHoraInscricao).fromNow()}
        </Box>
      </>
    )
  }),

  columnHelper.accessor('turma', {
    header: (info) => <DefaultHeader<InscricaoComAluno> info={info} name="Turma" />,
    cell: ({ row }) =>
      row.original.turma &&
      row.original.curso && (
        <>
          <Box>{formatTurma(row.original.turma, row.original.curso)}</Box>
          <Box textStyle="xs" color="fg.muted">
            {row.original.curso.nome}
          </Box>
        </>
      )
  })
]
