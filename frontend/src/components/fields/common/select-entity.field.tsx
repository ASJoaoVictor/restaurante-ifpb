import { OrvalGetAllWithoutPagination } from '@/types/api'
import { FieldValues } from 'react-hook-form'
import { SelectField, SelectFieldProps } from './select.field'

export interface SelectEntityProps<T extends FieldValues, TItem = any>
  extends Omit<SelectFieldProps<T, TItem>, 'items' | 'loading' | 'error'> {
  /** Hook to fetch the list of items */
  useListHook: OrvalGetAllWithoutPagination<TItem>
}

export function SelectEntityField<T extends FieldValues, TItem = any>(props: SelectEntityProps<T, TItem>) {
  const { useListHook, ...rest } = props
  const { data, isLoading, error } = useListHook()
  return <SelectField items={data || []} loading={isLoading} error={error} {...rest} />
}
