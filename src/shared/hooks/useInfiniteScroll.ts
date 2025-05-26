import { useEffect, useRef, useState } from 'react'

export const useInfiniteScroll = ({
  fetchNext,
  isFetching,
  hasNext,
}: {
  fetchNext: () => void
  isFetching: boolean
  hasNext?: boolean
}) => {
  const lastElementRef = useRef<HTMLDivElement | null>(null)
  const observer = useRef<IntersectionObserver | null>(null)
  const [enabled, setEnabled] = useState(true)

  useEffect(() => {
    if (observer.current) observer.current.disconnect()

    observer.current = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setEnabled(true)
      }
    })

    if (lastElementRef.current) observer.current.observe(lastElementRef.current)
  }, [])

  useEffect(() => {
    if (enabled && !isFetching && hasNext) {
      fetchNext()
      setEnabled(false)
    }
  }, [enabled, isFetching, hasNext])

  return { lastElementRef }

}
