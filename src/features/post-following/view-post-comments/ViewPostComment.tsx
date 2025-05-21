import { Items } from '@/api/post/posts-api.types'
import { Dialog, DialogContent, DialogTrigger } from '@/components/dialog'
import { Post } from '@/components/post/Post'
import { Typography } from '@honor-ui/inctagram-ui-kit'
import { useFetchCommentsQuery } from '@/api/comments/comments-api'

type Props = {
  opened: boolean
  setOpenedPost: (value: boolean) => void
  post: Items
}

export const ViewPostComment = ({ opened, post, setOpenedPost }: Props) => {
  const { data: commentsData } = useFetchCommentsQuery({ postId: post.id, pageNumber: 1 })

  return (
    <Dialog open={opened} onOpenChange={setOpenedPost}>
      <DialogTrigger asChild>
        <Typography as={'button'} variant={'bold_text14'}>
          View All Comments ({commentsData && commentsData?.totalCount})
        </Typography>
      </DialogTrigger>

      <DialogContent description="description">
        <Post post={post} />
      </DialogContent>
    </Dialog>
  )
}
