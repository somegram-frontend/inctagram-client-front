import { useGetUserPostsQuery } from '@/api/posts-api'
import { useRouter } from 'next/router'
import NavigationLayout from '@/components/layout/NavigationLayout'
import { useState } from 'react'
import { Dialog, DialogContent, DialogTrigger } from '@radix-ui/react-dialog'
import { Button } from '@honor-ui/inctagram-ui-kit'
import { Post } from './generalInformation/post/Post'

const Profile = () => {
  // const router = useRouter()
  // let id = JSON.stringify(router.query.id)
  // const { data } = useGetUserPostsQuery({ userId: id })

  const [openPost, setOpenPost] = useState(false)

  return (
    <NavigationLayout isAuth={true}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
          height: 'calc(99vh - 60px)',
        }}
      >
        My Profile
        <div>
          <Dialog open={openPost} onOpenChange={setOpenPost}>
            <DialogTrigger asChild>
              <Button variant="outlined">Post</Button>
            </DialogTrigger>
            <DialogContent>
              <Post />
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </NavigationLayout>
  )
}

export default Profile
