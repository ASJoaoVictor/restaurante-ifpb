import { createListCollection, Select } from '@chakra-ui/react'
import { SelectContent, SelectItem, SelectRoot, SelectTrigger, SelectValueText } from '../../ui/select'

const pageSizeList = createListCollection({
  items: [
    { label: '10', value: '10' },
    { label: '20', value: '20' },
    { label: '30', value: '30' },
    { label: '40', value: '40' },
    { label: '50', value: '50' },
    { label: '100', value: '100' }
  ]
})

type SelectPageSizeProps = Omit<Select.RootProps, 'collection'>

export function SelectPageSize(props: SelectPageSizeProps) {
  return (
    <SelectRoot collection={pageSizeList} size="md" width="100px" defaultValue={['10']} {...props}>
      <SelectTrigger>
        <SelectValueText />
      </SelectTrigger>

      <SelectContent>
        {pageSizeList.items.map((item) => (
          <SelectItem item={item} key={item.value}>
            {item.label}
          </SelectItem>
        ))}
      </SelectContent>
    </SelectRoot>
  )
}
