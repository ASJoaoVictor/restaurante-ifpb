import { useEffect, useState } from 'react'

export function useKeep<T>(currentValue: T | undefined) {
  const [value, setValue] = useState(currentValue)

  useEffect(() => {
    if (currentValue !== undefined) {
      setValue(currentValue)
    }
  }, [currentValue])

  return value
}
