import { useGetPublicProfileQuery } from '@/api/user/users-api'
import style from './profile.module.scss'
import Layout from '@/layout'
import { Loader } from '@/components/loader'
import { toast } from 'react-toastify'
import { useRouter } from 'next/router'
import { ImageOutline, Typography } from '@honor-ui/inctagram-ui-kit'
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/components/dialog'
import Image from 'next/image'
import { useMeQuery } from '@/api/auth/auth-api'
import { useGetUserPostsQuery } from '@/api/post/posts-api'
import { useEffect, useState } from 'react'
import { VisuallyHidden } from '@radix-ui/react-visually-hidden'
import { Post } from '@/pages/user/[id]/post'
import { ProfileResponse } from '@/api/user/users-api.types'

const Profile = () => {
  const router = useRouter()
  const { id, postId } = router.query
  const [openPost, setOpenPost] = useState(false)
  const [openPostId, setOpenPostId] = useState<string>('')
  const {
    isLoading,
    error,
    isError,
    data: publicData,
  } = useGetPublicProfileQuery({ id: id as string })

  const { isLoading: isLoadingMe, data: me } = useMeQuery()
  const { data: userPosts, isLoading: isPostsLoading } = useGetUserPostsQuery(
    {
      userId: id as string,
    },
    { skip: id === undefined }
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
  if (isLoading || isLoadingMe) return <Loader />

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
                src={publicData ? publicData.avatar.url : ''}
                className={style.profileAvatar}
                alt="my avatar"
                width={190}
                height={190}
              />
            ) : (
              <ImageOutline width={190} height={190} viewBox="0 0 25 25" />
            )}
            <div className={style.profileData}>
              <div className={style.profileNameAndBtnContainer}>
                <Typography variant="h1">{publicData?.userName}</Typography>
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
              <Typography variant="regular_text16">
                {publicData?.about || 'User did not write anything about himself'}
              </Typography>
            </div>
          </div>
          <div className={style.postsGrid}>
            {userPosts?.items.map(post => {
              return (
                <div key={post.id} className={style.postItem}>
                  <Dialog
                    open={openPost && openPostId === post.id}
                    onOpenChange={isOpen => {
                      if (!isOpen) handleClosePost()
                    }}
                  >
                    <DialogTrigger asChild>
                      <Image
                        src={post?.images[0]}
                        alt="my post"
                        width={230}
                        height={230}
                        className={style.postImage}
                        onClick={() => handlePostClick(post.id)}
                      />
                    </DialogTrigger>
                    <DialogContent description="description">
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
