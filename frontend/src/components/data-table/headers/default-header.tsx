import { Button, HStack } from '@chakra-ui/react'
import { HeaderContext } from '@tanstack/react-table'
import { PropsWithChildren } from 'react'
import { RiArrowUpLine } from 'react-icons/ri'
import { Tooltip } from '../../ui/tooltip'

interface DefaultHeaderProps<TData> {
  info: HeaderContext<TData, unknown>
  name: string
  tooltip?: string
}

export function DefaultHeader<TData>({ info, name, tooltip }: DefaultHeaderProps<TData>) {
  const sorted = info.column.getIsSorted()
  const canSort = info.column.getCanSort()

  const Wrapper = canSort ? SortButton : HStack

  return (
    <Tooltip content={tooltip} disabled={!tooltip} positioning={{ placement: 'top' }}>
      <Wrapper
        onClick={(e) => {
          e.preventDefault()
          if (!canSort) return
          info.column.toggleSorting(info.column.getIsSorted() === 'asc')
        }}
        align="center"
      >
        {name}
        {sorted && (
          <RiArrowUpLine
            style={{
              transform: sorted === 'asc' ? 'rotate(0deg)' : 'rotate(180deg)',
              transition: 'transform .3s ease'
            }}
          />
        )}
      </Wrapper>
    </Tooltip>
  )
}

function SortButton({ children, ...props }: PropsWithChildren) {
  return (
    <Button
      variant="ghost"
      _hover={{ bg: 'colorPalette.emphasized' }}
      colorPalette="gray"
      size="sm"
      h={6}
      p={0}
      {...props}
    >
      {children}
    </Button>
  )
}
