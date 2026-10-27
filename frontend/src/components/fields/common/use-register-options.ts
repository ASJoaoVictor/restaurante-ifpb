import dayjs from 'dayjs'
import { FieldValues, RegisterOptions } from 'react-hook-form'
import { HookFieldPropsWithInput } from './hook-field'

export function useRegisterOptions<T extends FieldValues>(props: HookFieldPropsWithInput<T>) {
  const registerOptions: RegisterOptions<T> = {}

  // Se o campo não permite vazio, define como null caso esteja vazio
  if (!props.allowEmpty) {
    registerOptions.setValueAs = (value) => (value === '' ? null : value)
  }

  // Se o campo é um número, converte o conteúdo para número
  if (props.type === 'number') {
    registerOptions.setValueAs = (value) => (value ? parseFloat(value) : props.allowEmpty || !props.required ? null : 0)
  }

  // Se o campo possui uma função setValueAs personalizada, utiliza ela
  if (props.setValueAs) {
    registerOptions.setValueAs = props.setValueAs
  }

  // Valor padrão
  if (props.defaultValue !== undefined) {
    registerOptions.value = props.defaultValue
  }

  // Validação de valor mínimo
  if (props.min !== undefined) {
    // BUG: Por algum motivo, a data mínima não é aceita
    const messageByType: Record<string, string> = {
      number: `O valor mínimo é ${props.min}`,
      date: `A data mínima é ${dayjs(props.min).toDate().toLocaleDateString()}`,
      time: `O horário mínimo é ${dayjs(props.min, ['HH:mm:ss', 'HH:mm']).toDate().toLocaleTimeString()}`,
      'datetime-local': `A data e hora mínima é ${dayjs(props.min).toDate().toLocaleString()}`
    }

    registerOptions.min = {
      value: props.min,
      message: props.type! in messageByType ? messageByType[props.type!] : `O valor mínimo é ${props.min}`
    }
  }

  // Validação de valor máximo
  if (props.max !== undefined) {
    // BUG: Por algum motivo, a data máxima não é aceita
    const messageByType: Record<string, string> = {
      number: `O valor máximo é ${props.max}`,
      date: `A data máxima é ${dayjs(props.max).toDate().toLocaleDateString()}`,
      time: `O horário máximo é ${dayjs(props.max, ['HH:mm:ss', 'HH:mm']).toDate().toLocaleTimeString()}`,
      'datetime-local': `A data e hora máxima é ${dayjs(props.max).toDate().toLocaleString()}`
    }

    registerOptions.max = {
      value: props.max,
      message: props.type! in messageByType ? messageByType[props.type!] : `O valor máximo é ${props.max}`
    }
  }

  // Validação de comprimento mínimo de texto
  if (props.minLength !== undefined) {
    registerOptions.minLength = {
      value: props.minLength,
      message: `Precisa ter no mínimo ${props.minLength} caracteres`
    }
  }

  // Validação de comprimento máximo de texto
  if (props.maxLength !== undefined) {
    registerOptions.maxLength = {
      value: props.maxLength,
      message: `Precisa ter no máximo ${props.maxLength} caracteres`
    }
  }

  // Validação de formato de email
  if (props.type === 'email') {
    registerOptions.pattern = { value: /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/, message: 'Email inválido' }
  }

  // Validação de formato de URL
  if (props.type === 'url') {
    registerOptions.validate = (value) => {
      try {
        new URL(value)
        return true
      } catch {
        return 'URL inválida'
      }
    }
  }

  // Validação de formato de regex
  if (props.pattern) {
    registerOptions.pattern = { value: props.pattern, message: 'Formato inválido' }
  }

  // Validação personalizada
  if (props.validate) {
    registerOptions.validate = props.validate
  }

  // Campo obrigatório
  if (!props.allowEmpty && props.required) {
    registerOptions.required = { value: true, message: 'Obrigatório' }
  }

  // Campo desabilitado
  if (props.disabled) {
    registerOptions.disabled = props.disabled
  }

  return registerOptions
}
