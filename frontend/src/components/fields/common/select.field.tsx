import {
  Box,
  createListCollection,
  Select,
  SelectControl,
  SelectIndicator,
  SelectIndicatorGroup,
  SelectValueChangeDetails,
  Span,
  Spinner,
  Stack
} from '@chakra-ui/react'
import isNil from 'lodash.isnil'
import { useMemo } from 'react'
import { FieldValues, Path } from 'react-hook-form'
import { getError } from '../../error/get-error'
import { SelectContent, SelectItem, SelectRoot, SelectTrigger, SelectValueText } from '../../ui/select'
import { HookField, HookFieldProps } from './hook-field'

export interface SelectFieldProps<T extends FieldValues, TItem = any> extends HookFieldProps<T> {
  /** Name of the field */
  name: Path<T>

  /** Placeholder do select */
  placeholder?: string

  /** Lista de itens do select */
  items: TItem[]

  /** Função que retorna o item em formato de string */
  itemToString?: (item: TItem) => string

  /** Função que retorna o valor do item */
  itemToValue?: (item: TItem) => any

  /** Função que retorna a descrição do item */
  itemToDescription?: (item: TItem) => string

  /** Indica se o select permite múltiplas seleções */
  multiple?: boolean

  /** Indica se o select está carregando */
  loading?: boolean

  /** Indica se o select está com erro */
  error?: any
}

export function SelectField<T extends FieldValues, TItem = any>(props: SelectFieldProps<T, TItem>) {
  const { itemToString, itemToValue, itemToDescription, items, loading, error, multiple, placeholder, ...rest } = props

  const collection = useMemo(() => {
    return createListCollection({
      items,
      itemToString,
      itemToValue
    })
  }, [itemToString, itemToValue, items])

  return (
    <HookField<T> defaultValue={multiple ? [] : (null as any)} {...rest}>
      {({ field, formState }) => {
        const value = multiple ? (field.value ?? []) : !isNil(field.value) ? [field.value] : []

        const handleValueChange = ({ value }: SelectValueChangeDetails<TItem>) => {
          if (multiple) {
            field.onChange(value ?? null)
          } else {
            field.onChange(value[0] ?? null)
          }
        }

        return (
          <SelectRoot
            collection={collection}
            value={value}
            onValueChange={handleValueChange}
            disabled={formState.isSubmitting || field.disabled}
            multiple={multiple}
          >
            <SelectControl>
              <SelectTrigger clearable>
                <SelectValueText
                  color={error ? 'fg.error/80' : undefined}
                  placeholder={
                    error ? 'Erro ao carregar itens' : loading ? 'Carregando...' : (placeholder ?? 'Selecione...')
                  }
                />
              </SelectTrigger>
              <SelectIndicatorGroup>
                {loading && <Spinner size="xs" borderWidth="1.5px" color="fg.muted" />}
                <SelectIndicator />
              </SelectIndicatorGroup>
            </SelectControl>
            <SelectContent>
              {loading && (
                <Box color="fg.muted" px={2} py={1.5}>
                  Carregando...
                </Box>
              )}

              {error && (
                <Box color="fg.error/80" px={2} py={1.5}>
                  <Box>Erro ao carregar itens</Box>
                  <Box textStyle="xs">{getError(error).description}</Box>
                </Box>
              )}

              {!loading && !error && collection.items.length === 0 && (
                <Box color="fg.muted" px={2} py={1.5}>
                  Nenhum item
                </Box>
              )}

              {collection.items.map((item, i) => (
                <SelectItem item={item} key={i}>
                  <Stack gap={0}>
                    <Select.ItemText>{itemToString ? itemToString(item) : String(item)}</Select.ItemText>
                    <Span color="fg.muted" textStyle="xs" hidden={!itemToDescription}>
                      {itemToDescription ? itemToDescription(item) : ''}
                    </Span>
                  </Stack>
                </SelectItem>
              ))}
            </SelectContent>
          </SelectRoot>
        )
      }}
    </HookField>
  )
}
