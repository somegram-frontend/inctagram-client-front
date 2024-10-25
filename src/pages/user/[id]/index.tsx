import { useGetUserPostsQuery } from '@/api/posts-api'
import { useRouter } from 'next/router'
import NavigationLayout from '@/components/layout/NavigationLayout'
import { useState } from 'react'
import { DialogTrigger, Dialog, DialogContent } from '@/components/dialog/Dialog'
import { Button, ImageOutline, Typography } from '@honor-ui/inctagram-ui-kit'
import { Post } from './generalInformation/post/Post'
import { useMeQuery } from '@/api/auth-api'
import { useGetProfileQuery } from '@/api/users-api'
import Image from 'next/image'
import s from '../uploadAvatar/uploadAvatar.module.scss'
import style from './generalInformation/user.module.scss'
import { EditPost } from './generalInformation/epitPost/EditPost'
import { DialogWithConfirm } from '@/components/dialogWithConfirm/DialogWithConfirm'
import { Loader } from '@/components/loader/Loader'

const Profile = () => {
  const router = useRouter()
  let id = router.query.id
  const {
    data: userPost,
    isLoading: isPostsLoading,
    isSuccess: isPostsSuccess,
  } = useGetUserPostsQuery(
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
      pathname: '/user/[id]/generalInformation',
      query: { id: me?.userId },
    })
  }

  if (isPostsLoading) {
    return <Loader />
  }

  if (isPostsSuccess) {
    return (
      <NavigationLayout isAuth={true}>
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
              <span>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
                exercitation ullamco{' '}
                <Typography variant="regular_link">
                  laboris nisi ut aliquip ex ea commodo consequat.
                </Typography>
              </span>
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
                <DialogContent>
                  <Post setEditPost={setEditPost} postData={postData} />
                </DialogContent>
              )}
            </Dialog>
          </div>
        </div>
      </NavigationLayout>
    )
  }
}

export default Profile
