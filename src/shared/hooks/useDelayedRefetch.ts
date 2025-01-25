import { useCallback, useState } from 'react'

export const useDelayedRefetch = (callback: () => void, delay: number) => {
  const [isLoading, setIsLoading] = useState(false)

  const delayedRefetch = useCallback(() => {
    setIsLoading(true)
    const timeoutId = setTimeout(() => {
      callback()
      setIsLoading(false)
    }, delay)

    // Возвращаем функцию очистки, если где-то будет нужен unmount
    return () => clearTimeout(timeoutId)
  }, [callback, delay])

  return {
    delayedRefetch,
    isLoading,
  }
}
