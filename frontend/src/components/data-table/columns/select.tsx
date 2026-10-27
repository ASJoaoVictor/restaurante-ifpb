import { Checkbox } from '@/components/ui/checkbox'
import { ColumnHelper } from '@tanstack/react-table'

export function getSelectColumn<TData>(columnHelper: ColumnHelper<TData>) {
  return columnHelper.display({
    id: 'checkbox',
    header: ({ table }) => (
      <Checkbox
        w="20px"
        checked={table.getIsSomePageRowsSelected() ? 'indeterminate' : table.getIsAllPageRowsSelected()}
        onCheckedChange={(changes) => table.toggleAllPageRowsSelected(Boolean(changes.checked))}
        aria-label="Selecionar todos"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        w="20px"
        checked={row.getIsSelected()}
        onCheckedChange={(changes) => row.toggleSelected(Boolean(changes.checked))}
        aria-label="Selecionar linha"
        data-interactive
      />
    ),
    enableSorting: false,
    enableHiding: false,
    size: 0
  })
}
