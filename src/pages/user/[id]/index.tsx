import { useGetUserPostsQuery } from '@/api/posts-api'
import { useRouter } from 'next/router'
import Layout from '@/pages/_layout'
import { useState } from 'react'
import { DialogTrigger, Dialog, DialogContent, DialogTitle } from '@/components/dialog'
import { Button, ImageOutline, Typography } from '@honor-ui/inctagram-ui-kit'
import { Post } from './post'
import { useMeQuery } from '@/api/auth-api'
import { useGetProfileQuery } from '@/api/users-api'
import Image from 'next/image'
import s from './profile/uploadProfileAvatar/uploadProfileAvatar.module.scss'
import style from './user.module.scss'
import { EditPost } from './post/editPost'
import { DialogWithConfirm } from '@/components/dialogWithConfirm'
import { Loader } from '@/components/loader'
import { VisuallyHidden } from '@radix-ui/react-visually-hidden'

const Profile = () => {
  const router = useRouter()
  let id = router.query.id
  const { data: userPost, isLoading: isPostsLoading } = useGetUserPostsQuery(
    {
      userId: id as string,
    },
    { skip: id === undefined }
  )

  let postData = userPost ? userPost?.items : []
  let imageSrc = userPost ? userPost?.items[0].images[0] : ''

  const { data: me } = useMeQuery()
  const { data: profile } = useGetProfileQuery()
  const [openPost, setOpenPost] = useState(false)
  const [editPost, setEditPost] = useState(false)

  const handleProfileSettingClick = () => {
    router.push({
      pathname: '/user/[id]/profile',
      query: { id: me?.userId },
    })
  }

  if (isPostsLoading) {
    return <Loader />
  }

  return (
    <Layout isAuth={true}>
      <div className={style.container}>
        <div className={style.profile}>
          {profile?.avatar.url ? (
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
        <div>
          <Dialog open={openPost} onOpenChange={setOpenPost}>
            <DialogTrigger asChild>
              <Image
                src={imageSrc}
                alt="my post"
                width={230}
                height={230}
                className={style.postImage}
              />
            </DialogTrigger>
            {editPost ? (
              <DialogWithConfirm
                onClose={setEditPost}
                title="Edit Post"
                confirmTitle="Close Post"
                confirmDescription={`Do you really want to close the edition of the publication? If you close changes won’t be saved`}
              >
                <EditPost setEditPost={setEditPost} postData={postData} />
              </DialogWithConfirm>
            ) : (
              <DialogContent description="description">
                <VisuallyHidden asChild>
                  <DialogTitle>Post dialog</DialogTitle>
                </VisuallyHidden>
                <Post setEditPost={setEditPost} postData={postData} />
              </DialogContent>
            )}
          </Dialog>
        </div>
      </div>
    </Layout>
  )
}

export default Profile
