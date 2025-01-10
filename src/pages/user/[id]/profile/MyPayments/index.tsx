import { Loader } from '@/components/loader'
import { Typography } from '@honor-ui/inctagram-ui-kit'
import { toast } from 'react-toastify'
import { getErrorMessage, useMyPayments } from './hooks/useMyPayments'
import s from './myPayments.module.scss'
import { Pagination } from './pagination/Pagination'
import { PaymentsTable } from './PaymentsTable'

export const MyPayments = () => {
  const { data, isLoading, isFetching, isSuccess, setNewParams, params, error } = useMyPayments()

  if (isLoading || isFetching) {
    return (
      <div className={s.loaderContainer}>
        <Loader />
      </div>
    )
  }

  let content
  if (isSuccess && data) {
    const { items, totalCount } = data
    content = items.length ? (
      <div>
        <div className={s.tableScrollContainer}>
          <PaymentsTable items={items} />
        </div>
        <Pagination totalCount={totalCount} searchParams={params} setNewParams={setNewParams} />
      </div>
    ) : (
      <Typography variant="regular_text16">You don't have any payments yet.</Typography>
    )
  } else if (error) {
    toast.error(getErrorMessage(error))
    content = null
  } else {
    content = null
  }
  return content
}
