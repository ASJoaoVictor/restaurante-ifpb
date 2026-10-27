import { OrvalPaginatedGetQueryKey, OrvalPaginatedQuery, OrvalRemoveQuery } from '@/types/api'
import { Box, Button, chakra, Flex, Stack, Table } from '@chakra-ui/react'
import { keepPreviousData } from '@tanstack/react-query'
import { Link, LinkProps } from '@tanstack/react-router'
import { ColumnDef, getCoreRowModel, Row, SortingState, useReactTable } from '@tanstack/react-table'
import { UIEvent, useMemo, useState } from 'react'
import { RiAddLine } from 'react-icons/ri'
import useLocalStorageState from 'use-local-storage-state'
import { ErrorComponent } from '../error/error-component'
import { TableNoResults } from './components/no-results'
import { SkeletonTable } from './components/skeleton-table'
import { TableActionBar } from './features/action-bar'
import { TablePagination } from './features/pagination'
import { TableSearch } from './features/search'
import { ColumnHeader } from './headers/column-header'
import { DefaultCell } from './headers/default-cell'

interface DataProviderTableProps<TData extends { id: string }> {
  id: string
  addPage?: LinkProps['to']
  listHook: OrvalPaginatedQuery<TData>
  removeHook: OrvalRemoveQuery<TData>
  getQueryKey: OrvalPaginatedGetQueryKey
  defaultSorting?: SortingState[number]
  columns: (
    listHook: OrvalPaginatedQuery<TData>,
    removeHook: OrvalRemoveQuery<TData>,
    getQueryKey: OrvalPaginatedGetQueryKey
  ) => ColumnDef<TData, any>[]
  onRowClick?: (row: Row<TData>) => void
}

export const TableContainer = chakra('div', {
  base: {
    maxW: '8xl'
  }
})

export function DataProviderTable<TData extends { id: string }>({
  id,
  addPage,
  listHook: useListHook,
  removeHook: useRemoveHook,
  getQueryKey,
  defaultSorting,
  columns,
  onRowClick
}: DataProviderTableProps<TData>) {
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useLocalStorageState(`${id}.pageSize`, { defaultValue: 10 })
  const [search, setSearch] = useState('')
  const [rowSelection, setRowSelection] = useState({})
  const [sorting, setSorting] = useLocalStorageState<SortingState>(`${id}.sorting`, {
    defaultValue: defaultSorting ? [defaultSorting] : []
  })

  const orderBy = sorting[0]?.id
  const orderDirection = sorting[0] ? (sorting[0].desc ? 'desc' : 'asc') : undefined

  const { data, isLoading, error, isRefetching, isFetched, refetch } = useListHook(
    { page, pageSize, orderBy, orderDirection, search },
    {
      query: {
        queryKey: getQueryKey({ page, pageSize, search, orderBy, orderDirection }),
        placeholderData: keepPreviousData
      }
    }
  )

  const showLoading = isLoading || (isRefetching && !isFetched)

  const tableData = useMemo(() => data?.items ?? [], [data?.items])
  const tableColumns = useMemo(
    () => columns(useListHook, useRemoveHook, getQueryKey),
    [columns, useListHook, useRemoveHook, getQueryKey]
  )

  const table = useReactTable<TData>({
    data: tableData,
    columns: tableColumns,
    rowCount: data?.total,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    onGlobalFilterChange: setSearch,
    onRowSelectionChange: setRowSelection,
    manualPagination: true,
    manualSorting: true,
    manualFiltering: true,
    getRowId: (row) => row.id,
    state: {
      sorting,
      globalFilter: search,
      rowSelection
    }
  })

  const handleRowClick = (e: UIEvent<HTMLElement>, row: Row<TData>) => {
    const target = e.target as HTMLElement
    if (target.closest('[data-interactive]')) return // Se o clique foi em um elemento interativo, ignora
    onRowClick?.(row)
  }

  return (
    <Stack gap={4}>
      <Flex gap={2}>
        <TableSearch search={search} setSearch={setSearch} />
        {addPage && (
          <Button
            asChild
            position={{ base: 'fixed', sm: 'static' }}
            size={{ base: 'xl', sm: 'md' }}
            bottom={4}
            right={4}
            zIndex={1}
          >
            <Link to={addPage}>
              <RiAddLine />
              Adicionar
            </Link>
          </Button>
        )}
      </Flex>

      <TableContainer>
        <Table.ScrollArea borderWidth="1px">
          <Table.Root size="sm" variant="outline" interactive>
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
              {isLoading && !data && <SkeletonTable pageSize={pageSize} columns={tableColumns} />}

              {error && (
                <Table.Row>
                  <Table.Cell colSpan={table.getVisibleFlatColumns().length} h={40} textAlign="center">
                    <ErrorComponent error={error} retry={refetch} />
                  </Table.Cell>
                </Table.Row>
              )}

              {data &&
                (table.getRowModel().rows.length ? (
                  table.getRowModel().rows.map((row) => (
                    <Table.Row
                      key={row.id}
                      data-selected={row.getIsSelected() ? '' : undefined}
                      onClick={(e) => handleRowClick(e, row)}
                      onKeyDown={(e) => e.key === 'Enter' && handleRowClick(e, row)}
                      tabIndex={onRowClick ? 0 : undefined}
                      cursor={onRowClick ? 'pointer' : 'default'}
                      focusRing="outside"
                    >
                      {row.getVisibleCells().map((cell) => (
                        <DefaultCell key={cell.id} cell={cell} loading={showLoading} />
                      ))}
                    </Table.Row>
                  ))
                ) : (
                  <Table.Row>
                    <Table.Cell colSpan={table.getVisibleFlatColumns().length} h={40} textAlign="center">
                      <TableNoResults />
                    </Table.Cell>
                  </Table.Row>
                ))}
            </Table.Body>
          </Table.Root>
        </Table.ScrollArea>
      </TableContainer>

      <Box borderWidth="1px" mt={-4}>
        <TablePagination page={page} setPage={setPage} pageSize={pageSize} setPageSize={setPageSize} data={data} />
        <TableActionBar table={table} removeHook={useRemoveHook} getQueryKey={getQueryKey} />
      </Box>
    </Stack>
  )
}
