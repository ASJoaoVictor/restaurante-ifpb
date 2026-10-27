import ms, { StringValue } from 'ms'
import { useEffect, useReducer } from 'react'

interface TimeUpdaterProps {
  children: () => React.ReactNode
  interval?: number | StringValue
}

export function IntervalUpdater({ children, interval = 1000 }: TimeUpdaterProps) {
  const [, render] = useReducer((x) => x + 1, 0)
  const intervalMs = typeof interval === 'number' ? interval : ms(interval)

  useEffect(() => {
    const timer = setInterval(() => void render(), intervalMs)
    return () => clearInterval(timer)
  }, [intervalMs])

  return children()
}
