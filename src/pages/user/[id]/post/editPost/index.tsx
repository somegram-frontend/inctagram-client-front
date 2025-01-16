import postStyle from '../../post/post.module.scss'
import s from './editPost.module.scss'
import Image from 'next/image'
import { Button, TextArea, Typography } from '@honor-ui/inctagram-ui-kit'
import defaultAva from '@/assets/images/Mask group.jpg'
import { useUpdateUserPostMutation } from '@/api/post/posts-api'
import { useState } from 'react'
import { ItemsType, UpdateUserPostResponse } from '@/api/post/posts-api.types'
import 'react-toastify/dist/ReactToastify.css'
import { toast } from 'react-toastify'
import { useForm } from 'react-hook-form'

type Props = {
  setEditPost?: (value: boolean) => void
  post: ItemsType
}

type DescriptionField = {
  description: string
}

const EditPost = ({ setEditPost, post }: Props) => {
  const postImage = post.images[0]
  const postDescription = post.description ? post.description : ''
  const userName = post.postOwnerInfo.username
  const userAvatar = post.postOwnerInfo.avatarUrl
  const postId = post.id

  const [updatePost, { isLoading, isSuccess, isError, error }] = useUpdateUserPostMutation()
  const [description, setDescription] = useState(postDescription)

  const {
    handleSubmit,
    register,
    watch,
    formState: { errors },
  } = useForm<DescriptionField>({
    defaultValues: {
      description: description,
    },
  })

  if (isError) {
    const err = error as { data: UpdateUserPostResponse }
    if (err.data.message) {
      const errorMessage = err.data.message
      errorMessage && toast.error(errorMessage)
      setEditPost && setEditPost(false)
    }
  }

  if (isSuccess) {
    setEditPost && setEditPost(false)
    {
      postDescription !== description && toast.success('Description has been changed')
    }
  }

  const onSubmit = (data: DescriptionField) => {
    setDescription(data.description)
    updatePost({ postId: postId, description: data.description })
  }

  return (
    <div className={s.container}>
      <Image src={postImage} alt="post image" width={490} height={560} className={s.postImage} />
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
            <Typography variant="bold_text16">{userName}</Typography>
          </div>
          <form className={s.descriptionEdit} onSubmit={handleSubmit(onSubmit)}>
            <TextArea
              label="Add publication descriptions"
              id={'description'}
              className={s.textArea}
              {...register('description', {
                maxLength: {
                  value: 500,
                  message: 'The post description should not exceed 500 characters.',
                },
              })}
            >
              {postDescription}
            </TextArea>
            {errors.description ? (
              <Typography variant="error_text">{errors.description.message}</Typography>
            ) : (
              <Typography variant="small_text" className={s.descriptionLength}>
                {`${watch('description').length}/500`}
              </Typography>
            )}
            <div className={s.button}>
              <Button disabled={isLoading}>Save Changes</Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default EditPost
