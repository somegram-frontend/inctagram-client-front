import {type ElementRef, forwardRef} from 'react'

import s from './pagination.module.scss'

import {Select, Typography} from '@honor-ui/inctagram-ui-kit'
import ArrowBack from './ArrowBack'
import ArrowForward from './ArrowForward'
import {MyPaymentsSearchParams} from '@/api/payments/payments-api.types'
import ButtonArrow from './ui/buttonArrow/ButtonArrow'
import MainPaginationButtons from './ui/mainPaginationButtons/MainPaginationButtons'
import {usePagination} from '@/shared/hooks/usePagination'
import {useTranslation} from "@/shared/hooks";

export type PaginationOption = {
  label: string
  value: string
}
export type PaginationProps = {
  siblingCount?: number
  totalCount: number
  searchParams: MyPaymentsSearchParams
  setNewParams: (newParams: MyPaymentsSearchParams) => void
}

const Pagination = forwardRef<ElementRef<'div'>, PaginationProps>(
  ({siblingCount, totalCount, searchParams, setNewParams}, ref) => {
    const {
      currentPage,
      isFirstPage,
      isLastPage,
      itemsPerPage,
      itemsPerPageChangeHandler,
      onCurrentPageChange,
      onNextPage,
      onPreviousPage,
      options,
      paginationRange,
    } = usePagination({siblingCount, totalCount, searchParams, setNewParams})
    const t = useTranslation('pagination')
    return (
      <div className={s.container} ref={ref}>
        <ButtonArrow disabled={isFirstPage} onClick={onPreviousPage}>
          <ArrowBack/>
        </ButtonArrow>
        <MainPaginationButtons
          currentPage={currentPage}
          onCurrentPageChange={onCurrentPageChange}
          paginationRange={paginationRange}
        />
        <ButtonArrow disabled={isLastPage} onClick={onNextPage}>
          <ArrowForward/>
        </ButtonArrow>
        <div className={s.selectBlock}>
          <Typography variant={'regular_text14'}>{t.show}&nbsp;</Typography>
          <Select
            onValueChange={itemsPerPageChangeHandler}
            options={options}
            small
            value={String(itemsPerPage)}
          />
          <Typography variant={'regular_text14'}>{t.onPage}</Typography>
        </div>
      </div>
    )
  },
)

Pagination.displayName = 'Pagination'

export default Pagination
