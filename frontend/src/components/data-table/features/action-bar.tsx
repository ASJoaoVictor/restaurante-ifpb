import { OrvalPaginatedGetQueryKey, OrvalRemoveQuery } from '@/types/api'
import { ActionBar, Button, Portal } from '@chakra-ui/react'
import { Table } from '@tanstack/react-table'
import { RiDeleteBinLine } from 'react-icons/ri'
import { useModal } from 'react-modal-hook'
import { ActionBarCloseTrigger, ActionBarContent, ActionBarRoot } from '../../ui/action-bar'
import { RemoveModal } from './remove'

export interface TableActionBarProps<TData> {
  table: Table<TData>
  removeHook: OrvalRemoveQuery<TData>
  getQueryKey: OrvalPaginatedGetQueryKey
}

export function TableActionBar<TData extends { id: string }>({
  table,
  removeHook,
  getQueryKey
}: TableActionBarProps<TData>) {
  const data = table.getSelectedRowModel().rows.map((row) => row.original)

  const [showModal, hideModal] = useModal(
    () => <RemoveModal data={data} removeHook={removeHook} closeModal={hideModal} getQueryKey={getQueryKey} />,
    [data]
  )

  return (
    <ActionBarRoot open={table.getSelectedRowModel().rows.length > 0} lazyMount>
      <Portal>
        <ActionBarContent>
          <ActionBar.SelectionTrigger>
            {table.getSelectedRowModel().rows.length} selecionados
          </ActionBar.SelectionTrigger>
          <ActionBar.Separator />
          <Button variant="outline" size="sm" colorPalette="red" onClick={showModal}>
            <RiDeleteBinLine />
            Excluir
          </Button>
          <ActionBarCloseTrigger onClick={() => table.resetRowSelection()} />
        </ActionBarContent>
      </Portal>
    </ActionBarRoot>
  )
}
