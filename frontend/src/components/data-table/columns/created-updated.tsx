import { IntervalUpdater } from '@/components/common/interval-updater'
import { Tooltip } from '@/components/ui/tooltip'
import { Span } from '@chakra-ui/react'
import { ColumnHelper } from '@tanstack/react-table'
import dayjs from 'dayjs'
import { DefaultHeader } from '../headers/default-header'

export function getCreatedAtColumn<TData extends { createdAt: string | null }>(columnHelper: ColumnHelper<TData>) {
  return columnHelper.accessor('createdAt' as any, {
    header: (info) => <DefaultHeader<TData> info={info} name="Criado" />,
    enableGlobalFilter: false,
    cell: (i) => (
      <Tooltip positioning={{ placement: 'top' }} content={dayjs(i.getValue() as string).format('DD/MM/YYYY HH:mm:ss')}>
        <Span color="fg.muted">
          <IntervalUpdater children={() => dayjs(i.getValue() as string).fromNow()} />
        </Span>
      </Tooltip>
    ),
    size: 0
  })
}

export function getUpdatedAtColumn<TData extends { updatedAt: string | null }>(columnHelper: ColumnHelper<TData>) {
  return columnHelper.accessor('updatedAt' as any, {
    header: (info) => <DefaultHeader<TData> info={info} name="Atualizado" />,
    enableGlobalFilter: false,
    cell: (i) => (
      <Tooltip positioning={{ placement: 'top' }} content={dayjs(i.getValue() as string).format('DD/MM/YYYY HH:mm:ss')}>
        <Span color="fg.muted">
          <IntervalUpdater children={() => dayjs(i.getValue() as string).fromNow()} />
        </Span>
      </Tooltip>
    ),
    size: 0
  })
}
