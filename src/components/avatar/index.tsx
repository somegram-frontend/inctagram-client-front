import Image from 'next/image'

import s from './avatar.module.scss'
import clsx from 'clsx'

type Props = {
  imgSrc?: string
  userName?: string
  width?: number
  height?: number
  className?: string
  backgroundFallback?: 'dark' | 'light'
  alt: string
}

export const Avatar = ({
  imgSrc,
  userName,
  width,
  height,
  alt,
  className,
  backgroundFallback,
}: Props) => {
  if (imgSrc) {
    return (
      <Image
        src={imgSrc}
        alt={alt}
        width={width}
        height={height}
        style={{ minWidth: `${width}px`, minHeight: `${height}px` }}
        className={clsx(className, s.avatar)}
      />
    )
  } else {
    return (
      <div
        className={clsx(className, s.fallback, backgroundFallback === 'dark' && s.fallbackDark)}
        style={{
          minWidth: `${width}px`,
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
