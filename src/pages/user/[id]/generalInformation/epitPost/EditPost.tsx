import postStyle from '../../generalInformation/post/post.module.scss'
import s from './editPost.module.scss'
import Image from 'next/image'
import { Button, TextArea, Typography } from '@honor-ui/inctagram-ui-kit'
import defaultAva from '../../../../../shared/images/Mask group.jpg'
import { useGetUserPostsQuery, useUpdateUserPostMutation } from '@/api/posts-api'
import { ChangeEvent, useState } from 'react'
import { useRouter } from 'next/router'

type Props = {
  setEditPost: (value: boolean) => void
  postImageSrc: string
  postDescription: string
  userId: string
}

export const EditPost = ({ setEditPost, postImageSrc, postDescription, userId }: Props) => {
  const [updatePost, { isLoading, isSuccess, isError }] = useUpdateUserPostMutation()

  const [description, setDescription] = useState(postDescription)

  const onPostChangeHandler = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const newDescription = e.currentTarget.value
    setDescription(newDescription)
  }

  const onPostSaveHandler = () => {
    updatePost({ id: userId, description: description })
    setEditPost(false)
  }

  return (
    <div className={s.container}>
      {/* <Image src="" alt="post image" className={postStyle.postImage} /> */}
      <Image
        src={postImageSrc}
        alt="post image"
        width={490}
        height={560}
        className={postStyle.postImage}
      />
      <div className={postStyle.descriptionContainer}>
        <div className={postStyle.wrapper}>
          <div className={postStyle.descriptionHeaderProfile}>
            <Image
              src={defaultAva}
              alt="user profile"
              className={postStyle.descriptionAvatarImage}
            />
            <span className={postStyle.descriptionUserName}>URLProfile</span>
          </div>
          <div className={s.descriptionEdit}>
            <Typography variant="regular_text14">Add publication descriptions</Typography>
            <TextArea className={s.textArea} onChange={onPostChangeHandler}>
              {/* Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
              incididunt ut labore et dolore magna aliqua. */}
              {postDescription}
            </TextArea>
            <Typography variant="small_text">200/500</Typography>
          </div>
          <div className={s.button}>
            {/* <Button onClick={() => setEditPost(false)}>Save Changes</Button> */}
            <Button onClick={onPostSaveHandler}>Save Changes</Button>
          </div>
        </div>
      </div>
    </div>
  )
}
