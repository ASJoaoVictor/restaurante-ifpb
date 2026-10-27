import { Table } from '@chakra-ui/react'
import { flexRender, Header } from '@tanstack/react-table'

export function ColumnHeader<TData>({ header }: { header: Header<TData, unknown> }) {
  return (
    <Table.ColumnHeader style={{ width: `${header.getSize()}px` }} whiteSpace="nowrap" colSpan={header.colSpan}>
      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
    </Table.ColumnHeader>
  )
}
