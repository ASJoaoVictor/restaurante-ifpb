import { IconButton } from '@chakra-ui/react'
import { memo } from 'react'
import { RiCloseLine, RiSearchLine } from 'react-icons/ri'
import { InputGroup } from '../../ui/input-group'
import { DebouncedInput } from '../../common/debounced-input'

export const TableSearch = memo(TableSearchMemo)

export interface TableSearchProps {
  search: string
  setSearch: (value: string) => void
}

function TableSearchMemo({ search, setSearch }: TableSearchProps) {
  return (
    <InputGroup
      w="full"
      startElement={<RiSearchLine />}
      endElementProps={{ pr: 0.5 }}
      endElement={
        <IconButton variant="ghost" size="sm" onClick={() => setSearch('')} hidden={!search}>
          <RiCloseLine />
        </IconButton>
      }
    >
      <DebouncedInput value={search} onChange={(value) => setSearch(value)} placeholder="Buscar..." />
    </InputGroup>
  )
}
