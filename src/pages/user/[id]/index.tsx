import { useMeQuery } from '@/api/auth/auth-api'
import { postsApi, selectAll, useGetUserPostsQuery } from '@/api/post/posts-api'
import { useGetProfileQuery } from '@/api/user/users-api'
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/components/dialog'
import { Post } from '@/components/post/Post'
import Layout from '@/layout'
import { useTranslation } from '@/shared/hooks'
import { useAppDispatch } from '@/store'
import { Button, CloseOutline, ImageOutline, Typography } from '@honor-ui/inctagram-ui-kit'
import { VisuallyHidden } from '@radix-ui/react-visually-hidden'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useEffect, useRef, useState } from 'react'
import EditPost from './post/editPost'
import s from './profile/uploadProfileAvatar/uploadProfileAvatar.module.scss'
import style from './user.module.scss'

const Profile = () => {
  const obs = useRef<IntersectionObserver | null>(null)

  const dispatch = useAppDispatch()

  const router = useRouter()
  const { id, postId } = router.query
  const t = useTranslation()

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
    return () => {
      dispatch(postsApi.util.invalidateTags(['Posts']))
    }
  }, [])

  useEffect(() => {
    if (!userPosts) {
      return
    }

    const options = {
      root: document.querySelector('#scroll-container'),
      rootMargin: '0px',
      threshold: 1.0,
    }

    let promise: any
    const callback: IntersectionObserverCallback = (entries, observer) => {
      const lastPost = entries[0]
      if (lastPost.isIntersecting) {
        if (userPosts?.items.length === userPosts.totalCount) {
          observer.unobserve(lastPost.target)
          return
        }
        const edgeId = userPosts?.items.at(-1)?.id
        promise = dispatch(
          postsApi.endpoints.getUserPosts.initiate({
            userId: id as string,
            endCursorPostId: edgeId,
          }),
        )
        observer.unobserve(lastPost.target)
      }
    }

    obs.current = new IntersectionObserver(callback, options)
    return () => promise?.unsubscribe()
  }, [userPosts])

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
  if (id !== me?.userId) {
    router.push(
      postId ? `/public-user/profile/${id}?postId=${postId}` : `/public-user/profile/${id}`,
    )
  }
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

  // if (isPostsLoading) {
  //   return <Loader />
  // }

  if (me?.userId && id === me?.userId) {
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
                  width={204}
                  height={204}
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
                  {t.profileSettings}
                </Button>
              </div>
              <div className={style.profileFollowersContainer}>
                <span>
                  2 218 <br />
                  {t.profile.following}
                </span>
                <span>
                  2 358 <br />
                  {t.profile.followers}
                </span>
                <span>
                  2 764 <br />
                  {t.profile.publications}
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
            {userPosts?.items.map((post, idx) => {
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
                        width={234}
                        height={228}
                        className={style.postImage}
                        onClick={() => handlePostClick(post.id)}
                        onLoad={e => {
                          if (userPosts.pagesCount > 1 && userPosts.items.length - 1 === idx)
                            if (obs.current) {
                              // debugger
                              obs.current.observe(e.currentTarget)
                            }
                        }}
                      />
                    </DialogTrigger>
                    {editPost ? (
                      <DialogContent title={'123'} withoutCloseIcon>
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

// send offset / endCursorPostId with every request
// check what is redux merge in the query
//    https://redux-toolkit.js.org/rtk-query/api/createApi
//    https://stackoverflow.com/questions/78363329/how-to-merge-data-from-rtk-query
//    https://redux-toolkit.js.org/rtk-query/usage/manual-cache-updates (-)
// forceRefetch
// serialize Query args
// https://www.youtube.com/watch?v=baKOWXZUoJQ&ab_channel=AdinnuBenedict

// response:
// {
//   "pageSize": 8,
//   "totalCount": 1,
//   "pagesCount": 1,
//   "items": [
//     {
//       "id": "6c7baa2a-bac4-4eca-a2de-491353ad0ab2",
//       "description": "string233333333333333",
//       "createdAt": "2024-10-08T08:34:36.573Z",
//       "updatedAt": "2024-10-08T08:36:27.891Z",
//       "images": [
//         "http://serveroleg.ru:9000/somegram/users/d207dc73-8002-4804-a6d2-037b786eb568/posts/68dda9be-df33-4628-9b8d-c25b10ed7511.png"
//       ],
//       "postOwnerInfo": {
//         "userId": "d207dc73-8002-4804-a6d2-037b786eb568",
//         "username": "jphn_dou",
//         "avatarUrl": "http://serveroleg.ru:9000/somegram/users/d207dc73-8002-4804-a6d2-037b786eb568/avatars/66841f84-cec2-4ea8-a3fd-661f74dca54b.jpeg"
//       }
//     }
//   ]
// }

// observer https://www.youtube.com/watch?v=2IbRtjez6ag&ab_channel=WebDevSimplified
// https://www.youtube.com/watch?v=a9GQFD5t6Jo&ab_channel=ArchakovBlog

// flow ->

// initial load ->
// if pageCount < 2 -> don't apply a watcher
// if pageCount > 2 -> apply a watcher to the last post

// User created a new post ->
// useGetUserPostsQuery tag will be invalidated, and a new
// request will be sent
// if pageCount < 2 -> don't apply a watcher
// if pageCount > 2 -> apply a watcher to the last post. The
// last post is [ not ] gonna be fully visible, because it will overflow
// the container and a scroll is gonna appear

// if user has more posts than the current page size and it intersected with the last
// post completely, then load a new portion of posts and merge them with
// the rest of posts.
// reload the page
