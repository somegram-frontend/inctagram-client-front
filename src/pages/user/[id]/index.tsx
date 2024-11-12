import { useGetUserPostsQuery } from '@/api/post/posts-api'
import { useRouter } from 'next/router'
import Layout from '@/layout'
import { useEffect, useState } from 'react'
import { DialogTrigger, Dialog, DialogContent, DialogTitle } from '@/components/dialog'
import { Button, ImageOutline, Typography } from '@honor-ui/inctagram-ui-kit'
import { Post } from './post'
import { useMeQuery } from '@/api/auth/auth-api'
import { useGetProfileQuery } from '@/api/user/users-api'
import Image from 'next/image'
import s from './profile/uploadProfileAvatar/uploadProfileAvatar.module.scss'
import style from './user.module.scss'
import { EditPost } from './post/editPost'
import { DialogWithConfirm } from './post/editPost/dialogWithConfirm'
import { Loader } from '@/components/loader'
import { VisuallyHidden } from '@radix-ui/react-visually-hidden'

const Profile = () => {
  const router = useRouter()
  const { id, postId } = router.query
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
      setOpenPostId(postId);
    }

    if (postId) {
      setOpenPost(true)
    }
  }, [postId])

  const { data: me } = useMeQuery()
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
  };

  if (isPostsLoading) {
    return <Loader />
  }

  return (
    <Layout>
      <div className={style.container}>
        <div className={style.profile}>
          {profile?.avatar?.url ? (
            <div className={s.profileAvaContainer}>
              <Image
                src={profile ? profile.avatar.url : ''}
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
              <Typography variant="h1">{me?.userName}</Typography>
              <Button variant="secondary" onClick={handleProfileSettingClick}>
                Profile Settings
              </Button>
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
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
              incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
              exercitation ullamco{' '}
              <Typography variant="regular_link">
                laboris nisi ut aliquip ex ea commodo consequat.
              </Typography>
            </Typography>
          </div>
        </div>
        <div className={style.postsGrid}>
          {userPosts?.items.map(post => {
            return (
              <div key={post.id} className={style.postItem}>
                <Dialog open={openPost && openPostId === post.id} onOpenChange={(isOpen) => {
                  if (!isOpen) handleClosePost()
                }}>
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
                    <DialogWithConfirm
                      onClose={setEditPost}
                      title="Edit Post"
                      confirmTitle="Close Post"
                      confirmDescription={`Do you really want to close the edition of the publication? If you close changes won’t be saved`}
                    >
                      <EditPost setEditPost={setEditPost} post={post} />
                    </DialogWithConfirm>
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

export default Profile
