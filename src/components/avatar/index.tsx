import Image from 'next/image'

import s from './avatar.module.scss'
import clsx from 'clsx'

type Props = {
  imgSrc?: string
  userName?: string
  width?: number
  height?: number
  className?: string
  alt: string
}

export const Avatar = ({ imgSrc, userName, width, height, alt, className }: Props) => {
  if (imgSrc) {
    return (
      <Image
        src={imgSrc}
        alt={alt}
        width={width}
        height={height}
        className={clsx(className, s.avatar)}
      />
    )
  } else {
    return (
      <div
        className={clsx(className, s.fallback)}
        style={{
          width: `${width}px`,
          height: `${height}px`,
        }}
      >
        <span>
          {userName
            ? userName
                .trim()
                .split(/\s=/)
                .map(part => part[0].toLocaleUpperCase())
                .join(',')
            : '?'}
        </span>
      </div>
    )
  }
}
