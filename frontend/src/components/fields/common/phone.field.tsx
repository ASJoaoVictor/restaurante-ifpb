import { FieldValues, Path, useFormContext } from 'react-hook-form'
import { useHookFormMask } from 'use-mask-input'
import { HookField, HookFieldPropsWithInput } from './hook-field'

export interface PhoneFieldProps<T extends FieldValues> extends HookFieldPropsWithInput<T> {
  /** Name of the field */
  name: Path<T>
}

export function PhoneField<T extends FieldValues>(props: PhoneFieldProps<T>) {
  const { register } = useFormContext<T>()
  const registerWithMask = useHookFormMask(register)
  const { ref, onBlur, onChange } = registerWithMask(props.name, '(99) 99999-9999')

  return (
    <HookField<T>
      type="tel"
      {...props}
      pattern={/\(\d{2}\) 9\d{4}-\d{4}/}
      ref={ref}
      onBlur={onBlur}
      onChange={onChange}
    />
  )
}
