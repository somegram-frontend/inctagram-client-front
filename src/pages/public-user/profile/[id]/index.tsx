import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'

import { useMeQuery } from '@/api/auth/auth-api'
import { useGetUserPostsQuery } from '@/api/post/posts-api'
import {
  useFollowUserMutation,
  useGetPublicProfileQuery,
  useGetUserProfileQuery,
  useUnfollowUserMutation,
} from '@/api/user/users-api'
import { ProfileResponse } from '@/api/user/users-api.types'
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/components/dialog'
import { Loader } from '@/components/loader'
import Layout from '@/layout'
import { VisuallyHidden } from '@radix-ui/react-visually-hidden'
import Image from 'next/image'
import { useRouter } from 'next/router'

import style from './profile.module.scss'
import { Button, ImageOutline, Typography } from '@honor-ui/inctagram-ui-kit'
import { Post } from '@/components/post/Post'
import s from '@/pages/user/[id]/profile/uploadProfileAvatar/uploadProfileAvatar.module.scss'
import { useTranslation } from '@/shared/hooks'
import { useAppSelector } from '@/store'
import { fetchIsAuth } from '@/api/auth/auth.selectors'
import clsx from 'clsx'
import { formatNumberWithSpaces } from '@/shared/utils/formatNumberWithSpaces'

const Profile = () => {
  const router = useRouter()
  const t = useTranslation()
  const { id, postId } = router.query
  const [openPost, setOpenPost] = useState(false)
  const [openPostId, setOpenPostId] = useState<string>('')
  const isAuth = useAppSelector(fetchIsAuth)
  const {
    data: publicData,
    error,
    isError,
    isLoading,
  } = useGetPublicProfileQuery({ id: id as string })

  console.log(publicData)

  const { data: me, isLoading: isLoadingMe } = useMeQuery()
  const { data: userPosts, isLoading: isPostsLoading } = useGetUserPostsQuery(
    {
      userId: id as string,
    },
    { skip: id === undefined },
  )

  const [followUser, { isLoading: isLoadingFollowUser }] = useFollowUserMutation()
  const [unfollowUser, { isLoading: isLoadingUnfollowUser }] = useUnfollowUserMutation()

  const { data: profileData, isLoading: isLoadingProfile } = useGetUserProfileQuery(
    {
      userId: id as string,
    },
    { skip: id === undefined },
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

  const handleFollowUser = () => {
    if (profileData) {
      if (profileData.isFollowing) {
        unfollowUser(profileData.id)
      } else followUser(profileData.id)
    }
  }

  if (!isLoading && typeof window !== 'undefined' && publicData?.id === me?.userId) {
    router.push(postId ? `/user/${me?.userId}?postId=${postId}` : `/user/${me?.userId}`)
  }
  if (isLoading || isLoadingMe || isLoadingProfile) {
    return <Loader fullHeight /> // TODO: Two loaders are developing on the My Profile page (this loader is called when you go to the My Profile page Although it should not be called in fact)
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
        <div className={clsx(style.container, !isAuth && style.public)}>
          <div className={style.profile}>
            {profileData?.avatar?.url ? (
              <div className={s.profileAvaContainer}>
                <Image
                  src={profileData?.avatar.url || ''}
                  className={s.profileAvatar}
                  alt="my avatar"
                  width={190}
                  height={190}
                />
              </div>
            ) : (
              <div className={s.defaultAvaContainer}>
                <ImageOutline />
              </div>
            )}
            <div className={style.profileData}>
              <div className={style.profileNameAndBtnContainer}>
                <Typography variant={'h1'}>{publicData?.userName}</Typography>
                {isAuth && (
                  <div className={style.activeBtns}>
                    <Button
                      onClick={handleFollowUser}
                      disabled={isLoadingFollowUser || isLoadingUnfollowUser}
                    >
                      {profileData?.isFollowing ? t.profile.btns.unfollow : t.profile.btns.follow}
                    </Button>
                    <Button variant={'secondary'}>{t.profile.btns.send}</Button>
                  </div>
                )}
              </div>
              <div className={style.profileFollowersContainer}>
                <span>
                  {profileData ? formatNumberWithSpaces(profileData.followingCount) : '2 218'}
                  <br />
                  Following
                </span>
                <span>
                  {profileData ? formatNumberWithSpaces(profileData.followersCount) : '2 358'}
                  <br />
                  Followers
                </span>
                <span>
                  2 764 <br />
                  Publications
                </span>
              </div>
              <Typography variant={'regular_text16'} className={style.profileAbout}>
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
