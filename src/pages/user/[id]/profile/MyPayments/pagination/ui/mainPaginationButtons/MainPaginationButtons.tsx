import type { PaginationRange } from '../../../../../../../../shared/hooks/usePagination'

import { type ElementRef, forwardRef } from 'react'
import Dots from '../dots/Dots'
import PageButton from '../pageButton/PageButton'

type Props = {
  currentPage: number
  onCurrentPageChange: (page: number) => void
  paginationRange: PaginationRange
}

const MainPaginationButtons = forwardRef<ElementRef<'button'> & ElementRef<'span'>, Props>(
  (props, ref) => {
    const { currentPage, onCurrentPageChange, paginationRange } = props
    const paginationButtons = paginationRange?.map((page, index) => {
      if (typeof page === 'string') {
        return <Dots key={index} ref={ref} />
      }

      return (
        <PageButton
          isSelected={currentPage === page}
          key={index}
          onClick={() => onCurrentPageChange(page)}
          page={page}
          ref={ref}
        />
      )
    })

    return <>{paginationButtons}</>
  }
)

MainPaginationButtons.displayName = 'MainPaginationButtons'

export default MainPaginationButtons
