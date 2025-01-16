import PhotoSlider from '@/components/photoSlider'
import {Typography} from '@honor-ui/inctagram-ui-kit'
import Image from 'next/image'
import s from './publicPost.module.scss'
import {ItemsType} from '@/api/post/posts-api.types'
import TimeAgo from 'react-timeago'
import {Dispatch, SetStateAction, useState} from 'react'
import clsx from 'clsx'
import {Dialog, DialogContent, DialogTitle, DialogTrigger} from '@/components/dialog'
import {VisuallyHidden} from '@radix-ui/react-visually-hidden'
import {useRouter} from 'next/router'
import {Post} from "@/components/post/Post";

type Props = {
  post: ItemsType;
  setOpenPost: Dispatch<SetStateAction<boolean>>;
  setOpenPostId: Dispatch<SetStateAction<string>>;
};

const PublicPost = ({post, setOpenPost, setOpenPostId}: Props) => {
  const defaultAva = '/MaskGroup.jpg';
  const router = useRouter();
  const [expanded, setExpanded] = useState(false);

  const onExpandedClick = () => setExpanded(prev => !prev);

  const defineTheDescription = (description?: string) => {
    if (!description) return '';

    if (description.length < 70) return description;

    if (description.length > 70 && !expanded) {
      return (
        <>
          {description.slice(0, 70)}...
          <Typography variant='regular_link' onClick={onExpandedClick}>Show more</Typography>
        </>
      );
    }

    if (description.length > 230 && expanded) {
      return (
        <>
          {description.slice(0, 230)}...
          <Typography variant='regular_link' onClick={onExpandedClick}>Hide</Typography>
        </>
      );
    }

    return description;
  };

  const handlePostClick = (id: string, postId: string) => {
    setOpenPostId(postId);
    setOpenPost(true);
    router.push(`/public-user/profile/${id}?postId=${postId}`);
  };

  const dotsClass = post?.images?.length > 1 ? s.publicPostDots : '';

  return (
    <Dialog>
      <div className={s.publicPost}>
        <DialogTrigger asChild>
          <PhotoSlider
            images={post?.images || []}
            dotClass={dotsClass}
            imgClass={clsx(expanded ? s.publicPostSliderImageExpanded : s.publicPostSliderImage)}
            clickCallback={() => handlePostClick(post.postOwnerInfo.userId, post.id)}
          />
        </DialogTrigger>
        <div className={s.publicPostArticle}>
          <div className={s.publicPostArticleHeader}>
            <Image
              src={post?.postOwnerInfo?.avatarUrl || defaultAva}
              width={35}
              height={35}
              alt='avatar image'
              className={s.publicPostUserAvatar}
            />
            <Typography variant='h3'>{post?.postOwnerInfo?.username || 'Unknown User'}</Typography>
          </div>
          <div className={s.publicPostArticleText}>
            <div className={s.publicPostTimeAgo}>
              <Typography variant='small_text'>
                <TimeAgo date={post?.createdAt} live={false}/>
              </Typography>
            </div>
            <Typography variant='regular_text14'>
              {defineTheDescription(post?.description)}
            </Typography>
          </div>
        </div>
      </div>
      <DialogContent description="description">
        <VisuallyHidden asChild>
          <DialogTitle>Post dialog</DialogTitle>
        </VisuallyHidden>
        <Post post={post}/>
      </DialogContent>
    </Dialog>
  );
};

export default PublicPost;