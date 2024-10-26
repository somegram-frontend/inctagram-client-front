import postStyle from '../../generalInformation/post/post.module.scss'
import s from './editPost.module.scss'
import Image from 'next/image'
import { Button, TextArea, Typography } from '@honor-ui/inctagram-ui-kit'
import defaultAva from '../../../../../shared/images/Mask group.jpg'
import { useUpdateUserPostMutation } from '@/api/posts-api'
import { ChangeEvent, useState } from 'react'
import { ItemsType, UpdateUserPostResponse } from '@/api/posts-api.types'
import 'react-toastify/dist/ReactToastify.css'
import { toast } from 'react-toastify'
import { capitalizeFirstLetter } from '@/shared/utils/capitalizeFirstLetter'

type Props = {
  setEditPost: (value: boolean) => void
  postData: ItemsType[]
}

export const EditPost = ({ setEditPost, postData }: Props) => {
  const [updatePost, { isLoading, isSuccess, isError, error }] = useUpdateUserPostMutation()
  const [descriptionError, setDescriptionError] = useState('')

  const postImage = postData[0].images[0]
  const postDescription = postData[0].description
  const userName = postData[0].postOwnerInfo.username
  const userAvatar = postData[0].postOwnerInfo.avatarUrl
  const postId = postData[0].id

  const [description, setDescription] = useState(postDescription)

  const onPostChangeHandler = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const newDescription = e.currentTarget.value
    setDescriptionError('')
    setDescription(newDescription)
  }

  const onPostSaveHandler = () => {
    updatePost({ postId: postId, description })
      .unwrap()
      .then(() => {
        setEditPost(false)
        toast.success('Description has been changed')
      })
      .catch(e => {
        const err = e as { data: UpdateUserPostResponse }
        const errorMessage = err.data.message
        if (err.data.errors) {
          const errorMessage = Object.values(err.data.errors[0].constraints)[0]
          setDescriptionError(capitalizeFirstLetter(errorMessage))
        } else {
          toast.error(errorMessage)
        }
      })
  }

  return (
    <div className={s.container}>
      <Image
        src={postImage}
        alt="post image"
        width={490}
        height={560}
        className={postStyle.postImage}
      />
      <div className={postStyle.descriptionContainer}>
        <div className={postStyle.wrapper}>
          <div className={postStyle.descriptionHeaderProfile}>
            <Image
              src={userAvatar || defaultAva}
              alt="user profile"
              width={40}
              height={40}
              className={postStyle.descriptionAvatarImage}
            />
            <span className={postStyle.descriptionUserName}>{userName}</span>
          </div>
          <div className={s.descriptionEdit}>
            <Typography variant="regular_text14">Add publication descriptions</Typography>
            <TextArea
              className={s.textArea}
              onChange={onPostChangeHandler}
              value={description}
              // maxLength={500}
            >
              {postDescription}
            </TextArea>
            {descriptionError ? (
              <Typography variant="error_text">{descriptionError}</Typography>
            ) : (
              <Typography variant="small_text" className={s.descriptionLength}>
                {description.length}/500
              </Typography>
            )}
          </div>
          <div className={s.button}>
            <Button onClick={onPostSaveHandler} disabled={isLoading}>
              Save Changes
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
