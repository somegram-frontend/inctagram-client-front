import { ArrowIosBack, ArrowIosForward } from '@honor-ui/inctagram-ui-kit'
import Image from 'next/image'
import Slider from 'react-slick'
import s from './photoSlider.module.scss'

type Props = {
  images: string[]
  className?: string
  dotClass?: string
  imgClass?: string
  clickCallback?: () => void | undefined
  onSetActiveImageIdx?: (nextIdx: number) => void
  activeImageIdx?: number
}

const PhotoSlider: React.FC<Props> = ({
  images,
  className,
  dotClass,
  imgClass,
  clickCallback,
  onSetActiveImageIdx,
  activeImageIdx,
}) => {
  const defaultAva = '/MaskGroup.jpg'

  const Arrow = ({ direction, onClick }: { direction: 'prev' | 'next'; onClick: () => void }) => {
    return (
      images.length > 1 && (
        <div
          className={direction === 'prev' ? s.customPrevArrow : s.customNextArrow}
          onClick={onClick}
        >
          {direction === 'prev' ? <ArrowIosBack /> : <ArrowIosForward />}
        </div>
      )
    )
  }

  const handleClick = () => {
    clickCallback && clickCallback()
  }

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    prevArrow: <Arrow direction="prev" onClick={() => {}} />,
    nextArrow: <Arrow direction="next" onClick={() => {}} />,
    adaptiveHeight: true,
    afterChange: (idx: number) => {
      onSetActiveImageIdx?.(idx)
    },
  }

  return (
    <div>
      <div className={s.sliderWrapper}>
        <Slider
          {...settings}
          className={className ? className : ''}
          dotsClass={dotClass ? dotClass : 'slick-dots'}
          ref={slider => {
            activeImageIdx !== undefined && slider?.slickGoTo(activeImageIdx)
          }}
        >
          {images?.map(imgSrc => (
            <div key={imgSrc} className={s.slide}>
              <Image
                src={imgSrc || defaultAva}
                alt="post images"
                width={492}
                height={504}
                className={imgClass || ''}
                onClick={handleClick}
              />
            </div>
          ))}
        </Slider>
      </div>
    </div>
  )
}

export default PhotoSlider
