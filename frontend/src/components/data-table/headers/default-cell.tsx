import { Skeleton, Table } from '@chakra-ui/react'
import { Cell, flexRender } from '@tanstack/react-table'

export function DefaultCell<TData>({ cell, loading }: { cell: Cell<TData, unknown>; loading: boolean }) {
  return (
    <Table.Cell style={{ width: `${cell.column.getSize()}px` }} whiteSpace="nowrap">
      <Skeleton loading={loading}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</Skeleton>
    </Table.Cell>
  )
}
