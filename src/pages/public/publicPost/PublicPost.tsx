import PhotoSlider from '@/components/photoSlider'
import { Typography } from '@honor-ui/inctagram-ui-kit'
import Image from 'next/image'
import s from './publicPost.module.scss'
import { ItemsType } from '@/api/post/posts-api.types'
import defaultAva from '@/assets/images/Mask group.jpg'
import TimeAgo from 'react-timeago'

type Props = {
    item: ItemsType
}

export const PublicPost = ({item}:Props) => {
console.log(item.createdAt)

    return (
        <div className={s.publicPost}>
            <PhotoSlider images={item.images} imgClass={s.publicPostSliderImage}/>
            <article className={s.publicPostArticle}>
                <header className={s.publicPostArticleHeader}>
                    <Image src={item.postOwnerInfo.avatarUrl || defaultAva} width={35} height={35} alt='avatar image' className={s.publicPostUserAvatar}/>
                    <Typography variant='h3'>URLProfile</Typography>
                </header>
                <p className={s.publicPostArticleText}>
                <Typography variant='small_text'>
                <TimeAgo date={item.createdAt} />
                </Typography>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incd... Show more
                </p>
            </article>
        </div>
    )
}