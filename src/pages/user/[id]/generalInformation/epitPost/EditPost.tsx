import postStyle from '../../generalInformation/post/post.module.scss'
import s from './editPost.module.scss'
import Image from 'next/image'
import { Button, TextArea, Typography } from '@honor-ui/inctagram-ui-kit'
import defaultAva from '../../../../../shared/images/Mask group.jpg'

type Props = {
  setEditPost: (value: boolean) => void
}

export const EditPost = ({ setEditPost }: Props) => {
  return (
    <div className={s.container}>
      <Image src="" alt="post image" className={postStyle.postImage} />
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
            <TextArea className={s.textArea}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
              incididunt ut labore et dolore magna aliqua.
            </TextArea>
            <Typography variant="small_text">200/500</Typography>
          </div>
          <div className={s.button}>
            <Button onClick={() => setEditPost(false)}>Save Changes</Button>
          </div>
        </div>
      </div>
    </div>
  )
}
