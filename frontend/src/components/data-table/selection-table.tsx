import { OrvalPaginatedGetQueryKey, OrvalPaginatedQuery } from '@/types/api'
import { Box, Stack, Table } from '@chakra-ui/react'
import { keepPreviousData } from '@tanstack/react-query'
import {
  ColumnDef,
  createColumnHelper,
  getCoreRowModel,
  OnChangeFn,
  RowSelectionState,
  SortingState,
  useReactTable
} from '@tanstack/react-table'
import { useMemo, useState } from 'react'
import useLocalStorageState from 'use-local-storage-state'
import { ErrorComponent } from '../error/error-component'
import { Checkbox } from '../ui/checkbox'
import { getSelectColumn } from './columns/select'
import { TableNoResults } from './components/no-results'
import { SkeletonTable } from './components/skeleton-table'
import { TablePagination } from './features/pagination'
import { TableSearch } from './features/search'
import { ColumnHeader } from './headers/column-header'
import { DefaultCell } from './headers/default-cell'
import { TableContainer } from './table'

interface DataSelectionTableProps<TData extends { id: string }> {
  id: string
  listHook: OrvalPaginatedQuery<TData>
  getQueryKey: OrvalPaginatedGetQueryKey
  defaultSorting?: SortingState[number]
  columns: (listHook: OrvalPaginatedQuery<TData>, getQueryKey: OrvalPaginatedGetQueryKey) => ColumnDef<TData, any>[]
  rowSelection: RowSelectionState
  setRowSelection: OnChangeFn<RowSelectionState>
  disabledRows?: string[]
}

export function DataSelectionTable<TData extends { id: string }>({
  id,
  listHook: useListHook,
  getQueryKey,
  defaultSorting,
  columns,
  rowSelection,
  setRowSelection,
  disabledRows = []
}: DataSelectionTableProps<TData>) {
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useLocalStorageState(`${id}.pageSize`, { defaultValue: 10 })
  const [search, setSearch] = useState('')
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
  const tableColumns = useMemo(() => columns(useListHook, getQueryKey), [columns, useListHook, getQueryKey])

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

  return (
    <Stack gap={4}>
      <TableSearch search={search} setSearch={setSearch} />
      <TableContainer>
        <Table.ScrollArea borderWidth="1px">
          <Table.Root size="sm" variant="outline" interactive>
            <Table.Header>
              {table.getHeaderGroups().map((headerGroup) => (
                <Table.Row key={headerGroup.id}>
                  <Table.ColumnHeader>
                    <Checkbox
                      w="20px"
                      checked={table.getIsSomePageRowsSelected() ? 'indeterminate' : table.getIsAllPageRowsSelected()}
                      onCheckedChange={(changes) => table.toggleAllPageRowsSelected(Boolean(changes.checked))}
                      aria-label="Selecionar todos"
                    />
                  </Table.ColumnHeader>

                  {headerGroup.headers.map((header) => (
                    <ColumnHeader key={header.id} header={header} />
                  ))}
                </Table.Row>
              ))}
            </Table.Header>

            <Table.Body>
              {isLoading && !data && (
                <SkeletonTable
                  pageSize={pageSize}
                  columns={[getSelectColumn(createColumnHelper<any>()), ...tableColumns]}
                />
              )}

              {error && (
                <Table.Row>
                  <Table.Cell colSpan={table.getVisibleFlatColumns().length} h={40} textAlign="center">
                    <ErrorComponent error={error} retry={refetch} />
                  </Table.Cell>
                </Table.Row>
              )}

              {data &&
                (table.getRowModel().rows.length ? (
                  table.getRowModel().rows.map((row) => {
                    const disabled = disabledRows.includes(row.original.id)
                    return (
                      <Table.Row
                        key={row.id}
                        data-selected={row.getIsSelected() ? '' : undefined}
                        focusRing="outside"
                        opacity={disabled ? 0.5 : 1}
                      >
                        <Table.Cell>
                          <Checkbox
                            w="20px"
                            checked={row.getIsSelected()}
                            onCheckedChange={(changes) => row.toggleSelected(Boolean(changes.checked))}
                            aria-label="Selecionar linha"
                            data-interactive
                            disabled={disabled}
                          />
                        </Table.Cell>
                        {row.getVisibleCells().map((cell) => (
                          <DefaultCell key={cell.id} cell={cell} loading={showLoading} />
                        ))}
                      </Table.Row>
                    )
                  })
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
      </Box>
    </Stack>
  )
}
