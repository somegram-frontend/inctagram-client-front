import PhotoSlider from '@/components/photoSlider'
import { Typography } from '@honor-ui/inctagram-ui-kit'
import Image from 'next/image'
import s from './publicPost.module.scss'
import { ItemsType } from '@/api/post/posts-api.types'
import defaultAva from '@/assets/images/Mask group.jpg'
import TimeAgo from 'react-timeago'
import { useState } from 'react'
import clsx from 'clsx'

type Props = {
    item: ItemsType
}

export const PublicPost = ({item}:Props) => {
    const [expanded, setExpanded] = useState(false)

    const onExpandedClick = () => {
        setExpanded(prev => !prev)
    }

    const defineTheDescription = (value: string) => {
        if (item?.description && item?.description?.length < 70) {
            return <Typography variant='regular_text14'>{item.description}</Typography>
        }
        if (item?.description && item?.description?.length > 70 && !expanded) {
            return (
            <Typography variant='regular_text14'>{item?.description?.slice(0, 70)}... 
                <Typography variant='regular_link' onClick={onExpandedClick}>Show more</Typography>  
            </Typography>
        )
        }
        if (item?.description && item?.description?.length > 230 && expanded) {
            return (
             <Typography variant='regular_text14'>{item?.description?.slice(0, 230)}...
                <Typography variant='regular_link' onClick={onExpandedClick}>Hide</Typography>  
             </Typography>
        )
        }
        return ''
    }

    return (
        <div className={s.publicPost}>
            <PhotoSlider images={item.images} imgClass={clsx(expanded ? 
                s.publicPostSliderImageExpanded : s.publicPostSliderImage )}/>
            <article className={s.publicPostArticle}>
                <header className={s.publicPostArticleHeader}>
                    <Image src={item.postOwnerInfo.avatarUrl || defaultAva} width={35} height={35} alt='avatar image' className={s.publicPostUserAvatar}/>
                    <Typography variant='h3'>{item.postOwnerInfo.username}</Typography>
                </header>
                <p className={s.publicPostArticleText}>
                    <div className={s.publicPostTimeAgo}>
                    <Typography variant='small_text'>
                        <TimeAgo date={item.createdAt} live={false}/>
                    </Typography>
                    </div>
                    {defineTheDescription(item?.description)}
                </p>
            </article>
        </div>
    )
}