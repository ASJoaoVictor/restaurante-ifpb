import { Skeleton, Table } from '@chakra-ui/react'
import { ColumnDef } from '@tanstack/react-table'

export function TableSkeleton<TData>({ pageSize, columns }: { pageSize: number; columns: ColumnDef<TData, any>[] }) {
  return (
    <Table.ScrollArea borderWidth="1px" mx="auto">
      <Table.Root size="sm" variant="outline" interactive whiteSpace="nowrap">
        <Table.Header>
          <Table.Row>
            {columns.map((column, idx) => (
              <Table.Cell key={idx}>
                <Skeleton height="24px" width="100px" />
              </Table.Cell>
            ))}
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {Array.from({ length: pageSize }).map((_, rowIndex) => (
            <Table.Row key={rowIndex}>
              {columns.map((_, cellIndex) => (
                <Table.Cell key={cellIndex}>
                  <Skeleton height="24px" />
                </Table.Cell>
              ))}
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </Table.ScrollArea>
  )
}
