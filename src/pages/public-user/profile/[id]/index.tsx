import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'

import { useMeQuery } from '@/api/auth/auth-api'
import { selectAll, useGetUserPostsQuery } from '@/api/post/posts-api'
import { useGetPublicProfileQuery } from '@/api/user/users-api'
import { ProfileResponse } from '@/api/user/users-api.types'
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/components/dialog'
import { Loader } from '@/components/loader'
import Layout from '@/layout'
import { VisuallyHidden } from '@radix-ui/react-visually-hidden'
import Image from 'next/image'
import { useRouter } from 'next/router'

import style from './profile.module.scss'
import { ImageOutline, Typography } from '@honor-ui/inctagram-ui-kit'
import { Post } from '@/components/post/Post'

const Profile = () => {
  const router = useRouter()
  const { id, postId } = router.query
  const [openPost, setOpenPost] = useState(false)
  const [openPostId, setOpenPostId] = useState<string>('')
  const {
    data: publicData,
    error,
    isError,
    isLoading,
  } = useGetPublicProfileQuery({ id: id as string })

  const { data: me, isLoading: isLoadingMe } = useMeQuery()
  const { data: userPosts, isLoading: isPostsLoading } = useGetUserPostsQuery(
    {
      userId: id as string,
    },
    {
      skip: id === undefined,
      selectFromResult: ({ data, ...rest }) => {
        if (!data) {
          return {
            data: undefined,
            ...rest,
          }
        }
        const { state, ...args } = data
        return {
          data: {
            items: selectAll(state),
            ...args,
          },
          ...rest,
        }
      },
    },
  )

  useEffect(() => {
    if (Array.isArray(postId)) {
      setOpenPostId(postId[0])
    } else if (typeof postId === 'string') {
      setOpenPostId(postId)
    }

    if (postId) {
      setOpenPost(true)
    }
  }, [postId])

  const handlePostClick = (postId: string) => {
    setOpenPostId(postId)
    setOpenPost(true)
    router.push({
      pathname: router.pathname,
      query: { ...router.query, postId },
    })
  }

  const handleClosePost = () => {
    setOpenPost(false)
    setOpenPostId('')
    const { postId, ...restQuery } = router.query

    router.push({ pathname: router.pathname, query: restQuery })
  }

  if (!isLoading && typeof window !== 'undefined' && publicData?.id === me?.userId) {
    router.push(postId ? `/user/${me?.userId}?postId=${postId}` : `/user/${me?.userId}`)
  }
  if (isLoading || isLoadingMe) {
    return <Loader />
  }

  if (isError) {
    const err = error as { data: ProfileResponse }

    if (err?.data?.errors) {
      const errorMessages = err?.data?.errors
        .map(e => Object.values(e.constraints).join(', '))
        .join('; ')

      errorMessages && toast.error(errorMessages)
    }
  }
  if (publicData?.id !== me?.userId) {
    return (
      <Layout>
        <div className={style.container}>
          <div className={style.profile}>
            {publicData?.avatar.url ? (
              <Image
                alt={'my avatar'}
                className={style.profileAvatar}
                height={190}
                src={publicData ? publicData.avatar.url : ''}
                width={190}
              />
            ) : (
              <ImageOutline height={190} viewBox={'0 0 25 25'} width={190} />
            )}
            <div className={style.profileData}>
              <div className={style.profileNameAndBtnContainer}>
                <Typography variant={'h1'}>{publicData?.userName}</Typography>
              </div>
              <div className={style.profileFollowersContainer}>
                <span>
                  2 218 <br />
                  Following
                </span>
                <span>
                  2 358 <br />
                  Followers
                </span>
                <span>
                  2 764 <br />
                  Publications
                </span>
              </div>
              <Typography variant={'regular_text16'}>
                {publicData?.about || 'User did not write anything about himself'}
              </Typography>
            </div>
          </div>
          <div className={style.postsGrid}>
            {userPosts?.items.map(post => {
              return (
                <div className={style.postItem} key={post.id}>
                  <Dialog
                    onOpenChange={isOpen => {
                      if (!isOpen) {
                        handleClosePost()
                      }
                    }}
                    open={openPost && openPostId === post.id}
                  >
                    <DialogTrigger asChild>
                      <Image
                        alt={'my post'}
                        className={style.postImage}
                        height={230}
                        onClick={() => handlePostClick(post.id)}
                        src={post?.images[0]}
                        width={230}
                      />
                    </DialogTrigger>
                    <DialogContent description={'description'}>
                      <VisuallyHidden asChild>
                        <DialogTitle>Post dialog</DialogTitle>
                      </VisuallyHidden>
                      <Post post={post} />
                    </DialogContent>
                  </Dialog>
                </div>
              )
            })}
          </div>
        </div>
      </Layout>
    )
  }
}

export default Profile
