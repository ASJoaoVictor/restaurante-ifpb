import { PaginatedData } from '@/types/api'
import { HStack } from '@chakra-ui/react'
import { memo } from 'react'
import { PaginationItems, PaginationNextTrigger, PaginationPrevTrigger, PaginationRoot } from '../../ui/pagination'
import { SelectPageSize } from '../components/select-pagesize'

export const TablePagination = memo(TablePaginationMemo)

export interface TablePaginationProps {
  page: number
  setPage: (page: number) => void
  pageSize: number
  setPageSize: (size: number) => void
  data?: PaginatedData<any>
}

function TablePaginationMemo({ page, setPage, pageSize, setPageSize, data }: TablePaginationProps) {
  return (
    <HStack gap={2} justify="space-between" p={3}>
      <PaginationRoot
        onPageChange={(e) => setPage(e.page)}
        count={data?.total}
        pageSize={pageSize}
        page={page}
        variant="outline"
        size="sm"
      >
        <PaginationPrevTrigger />
        <PaginationItems />
        <PaginationNextTrigger />
      </PaginationRoot>

      <SelectPageSize value={[String(pageSize)]} onValueChange={(e) => setPageSize(Number(e.value))} />
    </HStack>
  )
}
