import { ChamadaResultadoAlunoDto } from '@/api/endpoints/api.schemas'
import { Span } from '@chakra-ui/react'
import { createColumnHelper } from '@tanstack/react-table'
import { DefaultHeader } from '../data-table/headers/default-header'
import { ChamadaAprovadosAlunoDisplay } from '../displays/chamada-aprovados-aluno.display'

export const columnHelper = createColumnHelper<ChamadaResultadoAlunoDto>()

export const columnsAprovados = [
  columnHelper.accessor('id', {
    id: 'posicao',
    header: (info) => <DefaultHeader<ChamadaResultadoAlunoDto> info={info} name="Ord." tooltip="Ordem" />,
    cell: ({ row }) => <Span textStyle="lg">{row.index + 1}º</Span>,
    sortingFn: (rowA, rowB) => rowA.index - rowB.index,
    size: 0
  }),

  columnHelper.accessor('name', {
    header: (info) => <DefaultHeader<ChamadaResultadoAlunoDto> info={info} name="Nome" />,
    cell: (i) => <ChamadaAprovadosAlunoDisplay aluno={i.row.original} />,
    size: 0
  })
]
