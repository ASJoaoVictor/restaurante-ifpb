import { Table } from '@chakra-ui/react'
import { Skeleton } from '../../ui/skeleton'
import { ColumnDef } from '@tanstack/react-table'

export function SkeletonTable<TData>({ pageSize, columns }: { pageSize: number; columns: ColumnDef<TData>[] }) {
  return Array.from({ length: pageSize }).map((_, index) => (
    <Table.Row key={index}>
      {columns.map((_, cellIndex) => (
        <Table.Cell key={cellIndex}>
          <Skeleton height="24px" />
        </Table.Cell>
      ))}
    </Table.Row>
  ))
}
