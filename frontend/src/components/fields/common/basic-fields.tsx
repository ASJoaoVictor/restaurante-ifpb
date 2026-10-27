import { Checkbox, CheckboxProps } from '@/components/ui/checkbox'
import { Radio, RadioGroup } from '@/components/ui/radio'
import { Slider, SliderProps } from '@/components/ui/slider'
import { Switch, SwitchProps } from '@/components/ui/switch'
import { RadioGroupRootProps, Textarea, TextareaProps, VStack } from '@chakra-ui/react'
import { PropsWithChildren, ReactNode } from 'react'
import { FieldValues, Path, PathValue } from 'react-hook-form'
import { HookField, HookFieldPropsWithInput } from './hook-field'

export function TextField<T extends FieldValues>(props: HookFieldPropsWithInput<T>) {
  return <HookField<T> {...props} />
}

export function EmailField<T extends FieldValues>(props: HookFieldPropsWithInput<T>) {
  return <HookField<T> type="email" {...props} />
}

export function URLField<T extends FieldValues>(props: HookFieldPropsWithInput<T>) {
  return <HookField<T> type="url" {...props} />
}

export function NumberField<T extends FieldValues>(props: HookFieldPropsWithInput<T> & { int?: boolean }) {
  const { int, ...rest } = props

  const validateInt = (value: number) => {
    if (value % 1 !== 0) return 'Precisa ser um número inteiro'
    return true
  }

  return <HookField<T> type="number" validate={int ? validateInt : undefined} {...rest} />
}

export function DateField<T extends FieldValues>(props: HookFieldPropsWithInput<T>) {
  return <HookField<T> type="date" {...props} />
}

export function TimeField<T extends FieldValues>(props: HookFieldPropsWithInput<T>) {
  return <HookField<T> type="time" {...props} />
}

export function DateTimeField<T extends FieldValues>(props: HookFieldPropsWithInput<T>) {
  return <HookField<T> type="datetime-local" {...props} />
}

export function TextAreaField<T extends FieldValues>(props: HookFieldPropsWithInput<T> & TextareaProps) {
  return <HookField<T> defaultValue={'' as any} customComponent={Textarea} {...props} />
}

export function CheckboxField<T extends FieldValues>(
  props: Omit<HookFieldPropsWithInput<T>, 'children'> & CheckboxProps
) {
  const { children, ...rest } = props

  return (
    <HookField<T> defaultValue={false as any} {...rest}>
      {({ field, formState }) => (
        <Checkbox
          name={field.name}
          ref={field.ref}
          checked={field.value}
          onCheckedChange={({ checked }) => field.onChange(checked)}
          disabled={props.disabled || field.disabled || formState.isSubmitting}
          children={children}
        />
      )}
    </HookField>
  )
}

export function SwitchField<T extends FieldValues>(props: Omit<HookFieldPropsWithInput<T>, 'children'> & SwitchProps) {
  const { children, ...rest } = props

  return (
    <HookField<T> defaultValue={false as any} {...rest}>
      {({ field, formState }) => (
        <Switch
          name={field.name}
          ref={field.ref}
          checked={field.value}
          onCheckedChange={({ checked }) => field.onChange(checked)}
          disabled={props.disabled || field.disabled || formState.isSubmitting}
          children={children}
          {...props}
        />
      )}
    </HookField>
  )
}

export function RadioField<T extends FieldValues>(
  props: HookFieldPropsWithInput<T> &
    RadioGroupRootProps & {
      items: { id?: string | number; value: PathValue<T, Path<T>>; label: ReactNode }[]
      container?: React.ComponentType<PropsWithChildren>
    }
) {
  const Container =
    props.container ||
    (({ children }) => (
      <VStack gap={2} align="stretch">
        {children}
      </VStack>
    ))

  return (
    <HookField<T> defaultValue={null as any} {...props}>
      {({ field, formState }) => (
        <RadioGroup
          name={field.name}
          value={field.value}
          onValueChange={({ value }) => field.onChange(value)}
          disabled={props.disabled || field.disabled || formState.isSubmitting}
          {...props}
        >
          <Container>
            {props.items.map((item, index) => (
              <Radio key={item.id || index} value={item.value}>
                {item.label}
              </Radio>
            ))}
          </Container>
        </RadioGroup>
      )}
    </HookField>
  )
}

export function RangeField<T extends FieldValues>(props: HookFieldPropsWithInput<T> & SliderProps) {
  return (
    <HookField<T> defaultValue={props.min ?? (0 as any)} {...props}>
      {({ field, formState }) => (
        <Slider
          w="full"
          name={field.name}
          ref={field.ref}
          value={[field.value]}
          onValueChange={({ value }) => {
            field.onChange(value[0])
          }}
          onFocusChange={({ focusedIndex }) => {
            if (focusedIndex !== -1) return
            field.onBlur()
          }}
          disabled={props.disabled || field.disabled || formState.isSubmitting}
          {...props}
        />
      )}
    </HookField>
  )
}
