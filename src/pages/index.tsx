import '@honor-ui/inctagram-ui-kit/css'
import s from './index.module.scss'
import { GetTotalCountResponse } from '@/api/user/users-api.types'
import Layout from '@/layout'
import { GetPublicPostsResponse } from '@/api/post/posts-api.types'
import { useState } from 'react'
import { Dialog } from '@/components/dialog'
import PublicPost from './public/publicPost/PublicPost'
import RegisteredUsersList from './public/registeredUsersList/RegisteredUsersList'
import Image from 'next/image'

type Props = {
  totalUsersCount: GetTotalCountResponse
  publicPosts: GetPublicPostsResponse
}

export const getStaticProps = async () => {
  const totalUsersRes = await fetch('https://somegram.online/api/v1/public-users')
  const totalUsersCount = await totalUsersRes.json()

  const publicPostsRes = await fetch(
    'https://somegram.online/api/v1/public-posts/all/{endCursorPostId}?pageSize=4&sortBy=createdAt&sortDirection=desc',
  )
  const publicPosts = await publicPostsRes.json()

  return {
    props: {
      totalUsersCount,
      publicPosts,
    },
    revalidate: 60,
  }
}

export default function Public({ totalUsersCount, publicPosts }: Props) {
  const [openPost, setOpenPost] = useState(false)
  const [openPostId, setOpenPostId] = useState<string>('')

  const handleClosePost = () => {
    setOpenPost(false)
    setOpenPostId('')
  }

  return (
    <Layout>
      <div className={s.publicPage}>
        <RegisteredUsersList usersCount={totalUsersCount?.totalCount} />
        <div className={s.publicPosts}>
          {publicPosts?.items.map(post => {
            return (
              <Dialog
                key={post.id}
                open={openPost && openPostId === post.id}
                onOpenChange={isOpen => {
                  if (!isOpen) handleClosePost()
                }}
              >
                <PublicPost
                  post={post}
                  key={post.id}
                  setOpenPost={setOpenPost}
                  setOpenPostId={setOpenPostId}
                />
              </Dialog>
            )
          })}
        </div>
      </div>
    </Layout>
  )
}
