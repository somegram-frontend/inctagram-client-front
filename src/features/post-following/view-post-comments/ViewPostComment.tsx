import { Items } from '@/api/post/posts-api.types'
import { Dialog, DialogContent, DialogTrigger } from '@/components/dialog'
import { Post } from '@/components/post/Post'
import { Typography } from '@honor-ui/inctagram-ui-kit'

type Props = {
  opened: boolean
  setOpenedPost: (value: boolean) => void
  post: Items
  commentsCount?: number
}

export const ViewPostComment = ({ opened, post, setOpenedPost, commentsCount }: Props) => {
  return (
    <Dialog open={opened} onOpenChange={setOpenedPost}>
      <DialogTrigger asChild>
        <Typography as={'button'} variant={'bold_text14'}>
          View All Comments ({commentsCount})
        </Typography>
      </DialogTrigger>

      <DialogContent description="description">
        <Post post={post} />
      </DialogContent>
    </Dialog>
  )
}
