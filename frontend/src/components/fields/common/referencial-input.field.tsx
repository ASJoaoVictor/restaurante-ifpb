import { OrvalGetAllWithoutPagination } from '@/types/api'
import { Combobox, ComboboxRootProps, HStack, Portal, Span, Spinner, useListCollection } from '@chakra-ui/react'
import get from 'lodash.get'
import { useEffect } from 'react'
import { FieldValues, Path } from 'react-hook-form'
import { getError } from '../../error/get-error'
import { HookField, HookFieldProps } from './hook-field'

export interface ReferencialInputFieldProps<T extends FieldValues, TData extends { id: string }>
  extends HookFieldProps<T> {
  /** Name of the field */
  name: Path<T>

  /** Path to the item name in the list */
  itemNamePath: Path<TData>

  /** Function to convert an item to a string */
  itemToString?: (item: TData[Path<TData>]) => string

  /** Hook to fetch the list of items */
  useListHook: OrvalGetAllWithoutPagination<TData>

  /** Combobox props */
  comboboxProps?: Partial<ComboboxRootProps<TData>>
}

export function ReferencialInputField<T extends FieldValues, TData extends { id: string }>(
  props: ReferencialInputFieldProps<T, TData>
) {
  const { useListHook, itemNamePath, itemToString = String, comboboxProps, ...hookProps } = props
  const { data, isLoading, error } = useListHook()

  const { collection, set, filter } = useListCollection<TData>({
    initialItems: data ?? [],
    itemToString: (item) => itemToString(get(item, props.itemNamePath)),
    itemToValue: (item) => String(get(item, 'id')),
    filter: (itemText, filterText) => itemText.toLowerCase().includes(filterText.toLowerCase())
  })

  // Sync the collection with the fetched data
  useEffect(() => {
    if (data) {
      set(data)
    }
  }, [data, set])

  // Filter the collection based on the input value
  const handleInputChange = (details: Combobox.InputValueChangeDetails) => {
    filter(details.inputValue)
  }

  return (
    <HookField<T> defaultValue={null as any} {...hookProps}>
      {({ field, formState }) => {
        // console.log(field.name)
        const selectedItem = collection.items.find((item) => String(item.id) === String(field.value))

        return (
          <Combobox.Root
            w="full"
            positioning={{ sameWidth: false, placement: 'bottom-start' }}
            disabled={formState.isSubmitting || field.disabled}
            {...comboboxProps}
            collection={collection}
            onInputValueChange={handleInputChange}
            value={field.value ? [field.value] : []}
            // defaultInputValue={selectedItem ? itemToString(get(selectedItem, props.itemNamePath)) : ''}
            inputValue={selectedItem ? itemToString(get(selectedItem, props.itemNamePath)) : ''}
            onValueChange={({ value }) => field.onChange(value[0] || null)}
          >
            <Combobox.Control>
              <Combobox.Input ref={field.ref} />
              <Combobox.IndicatorGroup>
                <Combobox.ClearTrigger />
                <Combobox.Trigger />
              </Combobox.IndicatorGroup>
            </Combobox.Control>

            <Portal>
              <Combobox.Positioner>
                <Combobox.Content minW="sm">
                  <Combobox.Empty>Nenhum item encontrado</Combobox.Empty>

                  {isLoading && (
                    <HStack p="2">
                      <Spinner size="xs" borderWidth="1px" />
                      <Span>Carregando...</Span>
                    </HStack>
                  )}

                  {!isLoading && error && (
                    <Span p="2" color="fg.error">
                      {getError(error).description}
                    </Span>
                  )}

                  {!isLoading &&
                    !error &&
                    collection.items?.map((item) => (
                      <Combobox.Item key={item.id} item={item}>
                        {itemToString(get(item, props.itemNamePath))}
                        <Combobox.ItemIndicator />
                      </Combobox.Item>
                    ))}
                </Combobox.Content>
              </Combobox.Positioner>
            </Portal>
          </Combobox.Root>
        )
      }}
    </HookField>
  )
}
