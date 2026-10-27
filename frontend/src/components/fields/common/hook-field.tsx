import { Field } from '@/components/ui/field'
import { Input, InputProps } from '@chakra-ui/react'
import get from 'lodash.get'
import { RefCallback } from 'react'
import {
  Controller,
  ControllerProps,
  FieldValues,
  Path,
  PathValue,
  RegisterOptions,
  useFormContext
} from 'react-hook-form'
import { useRegisterOptions } from './use-register-options'

export interface HookFieldProps<T extends FieldValues> {
  /** Nome do campo */
  name?: Path<T>

  /** Valor inicial do campo */
  defaultValue?: PathValue<T, Path<T>>

  /** Rótulo do campo */
  label?: React.ReactNode

  /** Texto de ajuda/descrição */
  helperText?: React.ReactNode

  /** Campo desabilitado */
  disabled?: boolean

  /** Campo somente leitura */
  readOnly?: boolean

  /** Campo obrigatório */
  required?: boolean

  /** Permite valores vazios */
  allowEmpty?: boolean

  /** Tamanho mínimo do texto */
  minLength?: number

  /** Tamanho máximo do texto */
  maxLength?: number

  /** Valor mínimo (números/datas) */
  min?: string | number

  /** Valor máximo (números/datas) */
  max?: string | number

  /** Padrão regex para validação */
  pattern?: RegExp

  /** Função de validação customizada */
  validate?: RegisterOptions<T>['validate']

  /** Transformação do valor antes da submissão */
  setValueAs?: RegisterOptions<T>['setValueAs']

  /** Campo customizado usando Controller do react-hook-form */
  children?: ControllerProps<T>['render']

  /** Componente personalizado que possua as mesmas props de um <input> */
  customComponent?: React.ComponentType
}

export type HookFieldPropsWithInput<T extends FieldValues> = HookFieldProps<T> &
  Omit<InputProps, 'pattern' | 'children' | 'defaultValue' | 'accept'> & { ref?: RefCallback<HTMLInputElement> }

export function HookField<T extends FieldValues>(props: HookFieldPropsWithInput<T>) {
  const {
    name,
    allowEmpty,
    pattern,
    validate,
    setValueAs,
    label,
    helperText,
    disabled,
    required,
    readOnly,
    children,
    customComponent,
    ...inputProps
  } = props

  const form = useFormContext<T>()
  const { register, formState } = form || {}
  const { errors, isSubmitting } = formState || {}

  const error = get(errors, name || '')
  const registerOptions = useRegisterOptions<T>(props)

  const fieldProps = { label, helperText, disabled, required, readOnly }

  // eslint-disable-next-line @typescript-eslint/no-base-to-string
  const errorMessage = error?.message?.toString() || ''

  const Component = customComponent || Input

  return (
    <Field invalid={!!error} errorText={errorMessage} {...fieldProps}>
      {!name && <Component disabled={isSubmitting} {...inputProps} />}

      {name && children && (
        <Controller
          control={form.control}
          name={name}
          rules={registerOptions}
          render={children}
          defaultValue={registerOptions.value}
          disabled={registerOptions.disabled}
        />
      )}

      {name && !children && (
        <Component {...register?.(name, registerOptions)} disabled={isSubmitting} {...inputProps} />
      )}
    </Field>
  )
}
