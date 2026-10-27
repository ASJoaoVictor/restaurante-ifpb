import { ChamadaResultadoAlunoDto, ChamadaResultadoAlunosDto } from '@/api/endpoints/api.schemas'
import { Stack, Table } from '@chakra-ui/react'
import { getCoreRowModel, getFilteredRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table'
import { useState } from 'react'
import { columnsAprovados } from '@/components/columns/alunos-aprovados.columns'
import { TableNoResults } from '@/components/data-table/components/no-results'
import { TableSearch } from '@/components/data-table/features/search'
import { ColumnHeader } from '@/components/data-table/headers/column-header'
import { DefaultCell } from '@/components/data-table/headers/default-cell'
import { TableContainer } from '@/components/data-table/table'
import { Alert } from '@/components/ui/alert'

export function ListaAprovadosTable({ data }: { data: ChamadaResultadoAlunosDto }) {
  const [search, setSearch] = useState('')

  const table = useReactTable<ChamadaResultadoAlunoDto>({
    data: data.usuarios,
    columns: columnsAprovados,
    rowCount: data.usuarios.length,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getRowId: (row) => row.id,
    state: {
      globalFilter: search
    }
  })

  return (
    <TableContainer asChild mx="auto">
      <Stack gap={4}>
        {!data.minhaInscricao && <Alert status="warning" title="Você não se inscreveu nesta chamada" />}

        {data.minhaInscricao?.status === 'aceita' && <Alert status="success" title="Você foi contemplado nesta chamada" />}

        {data.minhaInscricao?.status !== 'aceita' && (
          <Alert status="error" title="Infelizmente, você não foi contemplado nesta chamada" />
        )}

        <TableSearch search={search} setSearch={setSearch} />

        <Table.ScrollArea borderWidth="1px">
          <Table.Root size="sm" variant="outline" interactive whiteSpace="nowrap">
            <Table.Header>
              {table.getHeaderGroups().map((headerGroup) => (
                <Table.Row key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <ColumnHeader key={header.id} header={header} />
                  ))}
                </Table.Row>
              ))}
            </Table.Header>

            <Table.Body>
              {table.getRowModel().rows.length ? (
                table.getRowModel().rows.map((row) => (
                  <Table.Row key={row.id} data-selected={row.getIsSelected() ? '' : undefined}>
                    {row.getVisibleCells().map((cell) => (
                      <DefaultCell key={cell.id} cell={cell} loading={false} />
                    ))}
                  </Table.Row>
                ))
              ) : (
                <Table.Row>
                  <Table.Cell colSpan={table.getVisibleFlatColumns().length} h={40} textAlign="center">
                    <TableNoResults />
                  </Table.Cell>
                </Table.Row>
              )}
            </Table.Body>
          </Table.Root>
        </Table.ScrollArea>
      </Stack>
    </TableContainer>
  )
}
