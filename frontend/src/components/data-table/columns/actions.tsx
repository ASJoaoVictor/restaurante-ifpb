import { OrvalPaginatedGetQueryKey, OrvalRemoveQuery } from '@/types/api'
import { IconButton, Menu, Portal } from '@chakra-ui/react'
import { Link, LinkProps } from '@tanstack/react-router'
import { ColumnHelper } from '@tanstack/react-table'
import { memo } from 'react'
import { RiDeleteBinLine, RiMore2Line, RiPencilLine } from 'react-icons/ri'
import { useModal } from 'react-modal-hook'
import { RemoveModal } from '../features/remove'

export interface ActionsColumnsProps<TData extends { id: string }> {
  link: LinkProps['to']
  removeHook: OrvalRemoveQuery<TData>
  getQueryKey: OrvalPaginatedGetQueryKey
}

export function getActionsColumn<TData extends { id: string }>(
  columnHelper: ColumnHelper<TData>,
  { link, removeHook: useRemoveHook, getQueryKey }: ActionsColumnsProps<TData>
) {
  return columnHelper.display({
    id: 'action',
    header: 'Ações',
    size: 0,
    cell: memo(({ row }) => {
      const data = row.original

      const [showModal, hideModal] = useModal(() => (
        <RemoveModal data={data} removeHook={useRemoveHook} getQueryKey={getQueryKey} closeModal={hideModal} />
      ))

      return (
        <Menu.Root lazyMount>
          <Menu.Trigger asChild>
            <IconButton aria-label="Ações" rounded="full" variant="ghost" data-interactive>
              <RiMore2Line />
            </IconButton>
          </Menu.Trigger>
          <Portal>
            <Menu.Positioner>
              <Menu.Content data-interactive>
                <Menu.Item asChild value="editar">
                  <Link to={link} params={{ id: data.id } as any}>
                    <RiPencilLine />
                    Editar
                  </Link>
                </Menu.Item>
                <Menu.Item value="excluir" color="fg.error" onClick={showModal}>
                  <RiDeleteBinLine />
                  Excluir
                </Menu.Item>
              </Menu.Content>
            </Menu.Positioner>
          </Portal>
        </Menu.Root>
      )
    })
  })
}
