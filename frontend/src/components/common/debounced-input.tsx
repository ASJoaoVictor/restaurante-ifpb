import { Input, InputProps } from '@chakra-ui/react'
import { useEffect, useState } from 'react'

export interface DebouncedInputProps extends Omit<InputProps, 'onChange'> {
  value: string
  onChange: (value: string) => void
  debounce?: number
}

export function DebouncedInput({ value: initialValue, onChange, debounce = 500, ...props }: DebouncedInputProps) {
  const [value, setValue] = useState(initialValue)

  useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value)
    }, debounce)

    return () => clearTimeout(timeout)
  }, [value, onChange, debounce])

  return <Input {...props} value={value} onChange={(e) => setValue(e.target.value)} />
}
