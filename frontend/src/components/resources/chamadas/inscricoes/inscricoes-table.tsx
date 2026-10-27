import { ChamadaComInscricoes, InscricaoComAluno } from '@/api/endpoints/api.schemas'
import { columnsInscricoes } from '@/components/columns/inscricoes.columns'
import { TableNoResults } from '@/components/data-table/components/no-results'
import { TableSearch } from '@/components/data-table/features/search'
import { ColumnHeader } from '@/components/data-table/headers/column-header'
import { DefaultCell } from '@/components/data-table/headers/default-cell'
import { Flex, Stack, Table } from '@chakra-ui/react'
import { getCoreRowModel, getFilteredRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { AdicionarInscricao } from './adicionar-inscricao'
import { isInscricaoEmLista, isPrimeiraInscricaoEmLista } from './utils'

export function InscricoesTable({ chamada }: { chamada: ChamadaComInscricoes }) {
  const [search, setSearch] = useState('')

  const table = useReactTable<InscricaoComAluno>({
    data: chamada.inscricoes,
    meta: { chamada: chamada.chamada },
    columns: columnsInscricoes,
    rowCount: chamada.inscricoes.length,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getRowId: (row) => row.inscricao.id,
    state: { globalFilter: search }
  })

  return (
    <Stack gap={4}>
      <Flex gap={2}>
        <TableSearch search={search} setSearch={setSearch} />
        <AdicionarInscricao chamada={chamada} />
      </Flex>

      <Table.ScrollArea borderWidth="1px" maxW="7xl">
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
                <Table.Row
                  asChild
                  key={row.id}
                  data-selected={row.getIsSelected() ? '' : undefined}
                  opacity={
                    !isInscricaoEmLista(chamada, row.index) || row.original.inscricao.status === 'aceita' ? 1 : 0.5
                  }
                  _hover={{ opacity: 1 }}
                  _focusWithin={{ opacity: 1 }}
                  transition="opacity .3s ease"
                  borderTopWidth={isPrimeiraInscricaoEmLista(chamada, row.index) ? 5 : undefined}
                >
                  <motion.tr key={row.id} layout transition={{ duration: 1, ease: 'easeInOut' }}>
                    {row.getVisibleCells().map((cell) => (
                      <DefaultCell key={cell.id} cell={cell} loading={false} />
                    ))}
                  </motion.tr>
                </Table.Row>
              ))
            ) : (
              <Table.Row>
                <Table.Cell colSpan={columnsInscricoes.length} h={40} textAlign="center">
                  <TableNoResults />
                </Table.Cell>
              </Table.Row>
            )}
          </Table.Body>
        </Table.Root>
      </Table.ScrollArea>
    </Stack>
  )
}
