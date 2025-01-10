import { useGetMyPaymentsQuery } from '@/api/payments/payments-api'
import { SerializedError } from '@reduxjs/toolkit'
import { FetchBaseQueryError } from '@reduxjs/toolkit/query'
import { useSearchParams, usePathname } from 'next/navigation'
import { useRouter } from 'next/router'
import type { MyPaymentsSearchParams } from '@/api/payments/payments-api.types'

export const getErrorMessage = (error: FetchBaseQueryError | SerializedError) => {
  let errorMessage
  if ('status' in error) {
    if (typeof error.status === 'number') {
      errorMessage =
        (
          error as {
            status: number
            data: { message?: string }
          }
        ).data?.message ?? JSON.stringify(error.data)
    } else {
      errorMessage = error.error
    }
  } else {
    errorMessage = error.message ?? 'Some error occured'
  }
  return errorMessage
}

const shouldSetNewParams = (params: MyPaymentsSearchParams, newParams: MyPaymentsSearchParams) => {
  return params.pageSize !== newParams.pageSize || params.pageNumber !== newParams.pageNumber
}

const userPickedDefaultParams = (newParams: MyPaymentsSearchParams) => {
  return (
    newParams.pageNumber === Number(DEFAULT_PAGE_NUMBER) &&
    newParams.pageSize === Number(DEFAULT_PAGE_SIZE)
  )
}

const allowedPageSizeOptions = new Set(['10', '20', '30', '50', '100'])

const sanitizeParams = (params: { pageSize: string; pageNumber: string }) => {
  const { pageSize, pageNumber } = params

  if (isNaN(Number(pageSize)) || isNaN(Number(pageNumber))) {
    return getDefaultParams()
  }
  if (!allowedPageSizeOptions.has(pageSize)) {
    return getDefaultParams()
  }

  return params
}

const getDefaultParams = () => {
  return { pageSize: DEFAULT_PAGE_SIZE, pageNumber: DEFAULT_PAGE_NUMBER }
}

const pageSizeChanged = (oldPageSize: number, newPageSize: number) => {
  return oldPageSize !== newPageSize
}

const DEFAULT_PAGE_SIZE = '10'
const DEFAULT_PAGE_NUMBER = '1'

export const useMyPayments = () => {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const router = useRouter()

  let pageSize = searchParams.get('pageSize')
  let pageNumber = searchParams.get('pageNumber')

  if (!(pageSize && pageNumber)) {
    ;({ pageSize, pageNumber } = getDefaultParams())
  } else {
    ;({ pageSize, pageNumber } = sanitizeParams({ pageSize, pageNumber }))
  }

  const params = { pageSize: Number(pageSize), pageNumber: Number(pageNumber) }

  const { data, isLoading, isFetching, isSuccess, error } = useGetMyPaymentsQuery(params)

  const setNewParams = (newParams: { pageNumber: number; pageSize: number }) => {
    if (shouldSetNewParams(params, newParams)) {
      router.replace({
        pathname,
        query: userPickedDefaultParams(newParams)
          ? undefined
          : pageSizeChanged(params.pageSize, newParams.pageSize)
          ? { pageNumber: DEFAULT_PAGE_NUMBER, pageSize: newParams.pageSize }
          : newParams,
      })
    }
  }

  return {
    isLoading,
    isFetching,
    isSuccess,
    setNewParams,
    params,
    error,
    data,
  }
}
