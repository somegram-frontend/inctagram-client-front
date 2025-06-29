import { useGetUserPostsQuery } from '@/api/post/posts-api'
import { useRouter } from 'next/router'
import Layout from '@/layout'
import { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/components/dialog'
import { Button, CloseOutline, Typography } from '@honor-ui/inctagram-ui-kit'
import { useMeQuery } from '@/api/auth/auth-api'
import { useGetProfileMetricsQuery, useGetProfileQuery } from '@/api/user/users-api'
import Image from 'next/image'
import style from './user.module.scss'
import { Loader } from '@/components/loader'
import { VisuallyHidden } from '@radix-ui/react-visually-hidden'
import { Post } from '@/components/post/Post'
import EditPost from './post/editPost'
import { useTranslation } from '@/shared/hooks'
import { formatNumberWithSpaces } from '@/shared/utils/formatNumberWithSpaces'
import s from './profile/uploadProfileAvatar/uploadProfileAvatar.module.scss'
import { Avatar } from '@/components/avatar'

const Profile = () => {
  const router = useRouter()
  const { id, postId } = router.query
  const t = useTranslation()
  const { data: userPosts, isLoading: isPostsLoading } = useGetUserPostsQuery({
    userId: id as string,
  })

  const { data: userMetrics, isLoading: isMetricsLoading } = useGetProfileMetricsQuery({
    userId: id as string,
  })

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

  const { data: me } = useMeQuery()

  useEffect(() => {
    if (me?.userId && id !== me.userId) {
      router.push(
        postId ? `/public-user/profile/${id}?postId=${postId}` : `/public-user/profile/${id}`,
      )
    }
  }, [me, id, postId, router])

  const { data: profile } = useGetProfileQuery()
  const [openPost, setOpenPost] = useState(false)
  const [openPostId, setOpenPostId] = useState<string>('')
  const [editPost, setEditPost] = useState(false)

  const handleProfileSettingClick = () => {
    router.push({
      pathname: '/user/[id]/profile',
      query: { id: me?.userId },
    })
  }

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

  if (isPostsLoading || isMetricsLoading) {
    return <Loader fullHeight /> // TODO: Two loaders are developing on the My Profile page
  }
  if (me?.userId && id === me?.userId) {
    return (
      <Layout>
        <div className={style.container}>
          <div className={style.profile}>
            <div className={s.profileAvaContainer}>
              <Avatar
                userName={profile?.userName}
                imgSrc={profile?.avatar.url}
                alt={'my avatar'}
                width={190}
                height={190}
                className={s.avatar}
              />
            </div>
            <div className={style.profileData}>
              <div className={style.profileNameAndBtnContainer}>
                <Typography variant="h1">{me?.userName}</Typography>
                <Button variant="secondary" onClick={handleProfileSettingClick}>
                  {t.profileSettings}
                </Button>
              </div>
              {!isMetricsLoading && (
                <div className={style.profileFollowersContainer}>
                  <span>
                    {userMetrics?.followingCount &&
                      formatNumberWithSpaces(userMetrics.followingCount)}
                    <br />
                    {t.profile.following}
                  </span>
                  <span>
                    {userMetrics?.followersCount &&
                      formatNumberWithSpaces(userMetrics?.followersCount)}
                    <br />
                    {t.profile.followers}
                  </span>
                  <span>
                    {userMetrics?.publicationsCount &&
                      formatNumberWithSpaces(userMetrics?.publicationsCount)}
                    <br />
                    {t.profile.publications}
                  </span>
                </div>
              )}
              <Typography variant="regular_text16">{}</Typography>
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
                    {editPost ? (
                      <DialogContent title={'Edit'}>
                        <DialogTrigger asChild className={s.triggerBtn}>
                          <CloseOutline onClick={() => setEditPost(false)} />
                        </DialogTrigger>
                        <EditPost setEditPost={setEditPost} post={post} />
                      </DialogContent>
                    ) : (
                      <DialogContent description="description">
                        <VisuallyHidden asChild>
                          <DialogTitle>Post dialog</DialogTitle>
                        </VisuallyHidden>
                        <Post setEditPost={setEditPost} post={post} />
                      </DialogContent>
                    )}
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
