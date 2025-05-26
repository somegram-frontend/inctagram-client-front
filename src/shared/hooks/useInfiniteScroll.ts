import { useEffect, useRef } from 'react'

type UseInfiniteScrollOptions = {
  hasMore: boolean
  isLoading: boolean
  onLoadMore: () => void
  threshold?: number
}

export const useInfiniteScroll = ({
  hasMore,
  isLoading,
  onLoadMore,
  threshold = 1,
}: UseInfiniteScrollOptions) => {
  const observerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!observerRef.current) return

    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          onLoadMore()
        }
      },
      { threshold },
    )

    observer.observe(observerRef.current)

    return () => {
      observer.disconnect()
    }
  }, [hasMore, isLoading, onLoadMore, threshold])

  return { observerRef }
}
