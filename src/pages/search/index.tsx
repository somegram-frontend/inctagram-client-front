import { Input, Typography } from '@honor-ui/inctagram-ui-kit'
import { ChangeEvent, KeyboardEvent, useEffect, useMemo, useState } from 'react'
import Layout from '@/layout'
import Image from 'next/image'

import s from './search.module.scss'
import { useTranslation } from '@/shared/hooks'
import { useGetUsersQuery } from '@/api/user/users-api'
import { useInfiniteScroll } from '@/shared/hooks/useInfiniteScroll'
import { UserItem } from '@/api/user/users-api.types'
import { Loader } from '@/components/loader'
import { truncate } from '@/shared/utils/truncate'
import { getInitials } from '@/shared/utils/getInitials'

const SearchPage = () => {
  const [pageNumber, setPageNumber] = useState(1)
  const [users, setUsers] = useState<UserItem[]>([])
  const [searchValue, setSearchValue] = useState('')
  const [isSearchedOnce, setIsSearchedOnce] = useState(false)
  const [endCursorPostId, setEndCursorPostId] = useState('')
  const t = useTranslation()

  const queryArgs = useMemo(
    () => ({
      pageNumber,
      pageSize: 8,
      search: searchValue,
      endCursorPostId: endCursorPostId,
    }),
    [pageNumber, searchValue],
  )

  const { data, isFetching, isLoading } = useGetUsersQuery(queryArgs, {
    skip: !searchValue.trim(),
    refetchOnMountOrArgChange: true,
  })

  useEffect(() => {
    if (searchValue.trim() === '') {
      setUsers([])
      setIsSearchedOnce(false)
      return
    }

    setPageNumber(1)
  }, [searchValue])

  useEffect(() => {
    if (!data) return

    if (pageNumber === 1) {
      setUsers(data.items)
    } else {
      setUsers(prev => [...prev, ...data.items])
    }

    if (!isSearchedOnce && searchValue.trim() !== '') {
      setIsSearchedOnce(true)
    }
  }, [data, pageNumber, searchValue])

  // const { observerRef } = useInfiniteScroll({
  //   hasMore: !!data?.items.length && data.pageNumber < data.pagesCount,
  //   isLoading: isFetching,
  //   onLoadMore: () => {
  //     if (!isFetching && data && data.pageNumber < data.pagesCount) {
  //       setPageNumber(prev => prev + 1)
  //     }
  //   },
  // })

  const { lastElementRef } = useInfiniteScroll({
    isFetching,
    hasNext: Boolean(data?.items.length),
    fetchNext: () => {
      if (!isFetching && data && data.pageNumber < data.pagesCount) {
        setPageNumber(prev => prev + 1)
      }
      if (data?.items) {
        setUsers(prev => [...prev, ...data?.items])
        setEndCursorPostId(data?.items.at(-1)?.id || '')
      }
    },
  })

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchValue(value)

    if (value.trim() === '') {
      setUsers([])
      setIsSearchedOnce(false)
    }
  }

  const handleClearSearch = () => {
    setSearchValue('')
    setUsers([])
    setPageNumber(1)
    setIsSearchedOnce(false)
  }

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchValue.trim()) {
      setPageNumber(1)
    }
  }

  const renderUsersList = () => {
    if (searchValue.trim() === '') {
      return null
    }

    if (isLoading && pageNumber === 1) {
      return <Loader />
    }

    // if (
    //   isSearchedOnce &&
    //   searchValue.trim().length > 0 &&
    //   !isFetching &&
    //   !isLoading &&
    //   users.length === 0
    // ) {
    //   return (
    //     <div className={s.notFoundContent}>
    //       <Typography variant={'bold_text16'} className={s.notFoundTitle}>
    //         {t.searchPage.usersNotFound.title}
    //       </Typography>
    //       <div className={s.notFoundInfo}>
    //         <Typography variant={'bold_text14'}>
    //           {t.searchPage.usersNotFound.info.message}
    //         </Typography>
    //         <Typography variant={'small_text'}>{t.searchPage.usersNotFound.info.detail}</Typography>
    //       </div>
    //     </div>
    //   )
    // }

    return (
      <>
        {users &&
          users.map(user => (
            <div key={user.id} className={s.card}>
              {user.avatar?.url ? (
                <Image
                  src={user.avatar.url}
                  alt={`${user.userName} avatar`}
                  className={s.cardAvatar}
                  width={48}
                  height={48}
                />
              ) : (
                <div className={s.cardAvatar}>{getInitials(user.userName)}</div>
              )}
              <div className={s.cardInfo}>
                <Typography
                  variant="bold_text14"
                  as={'a'}
                  className={s.name}
                  href={`/public-user/profile/${user.id}`}
                >
                  {user.userName}
                </Typography>
                <Typography variant="regular_text14" className={s.about}>
                  {truncate(user.about || '', 15)}
                </Typography>
              </div>
            </div>
          ))}

        {isFetching && <Loader />}
        {users.length > 0 && <div ref={lastElementRef} style={{ height: '1px' }} />}
      </>
    )
  }

  return (
    <Layout>
      <div className={s.container}>
        <Typography variant={'h1'}>{t.search}</Typography>

        <Input
          placeholder={t.search}
          value={searchValue}
          onChange={handleSearchChange}
          onInputClear={handleClearSearch}
          onKeyPress={handleKeyPress}
          search
        />

        <div className={s.usersList}>{renderUsersList()}</div>
      </div>
    </Layout>
  )
}

export default SearchPage
