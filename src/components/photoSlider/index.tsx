import Slider from 'react-slick'
import s from './photoSlider.module.scss'
import {ArrowIosBack, ArrowIosForward} from '@honor-ui/inctagram-ui-kit'
import Image from 'next/image'

type Props = {
  images: string[]
  className?: string
  dotClass?: string
  imgClass?: string
  clickCallback?: () => void | undefined
  appliedFilter?: string
}

const PhotoSlider: React.FC<Props> = ({images, className, dotClass, imgClass, clickCallback, appliedFilter}) => {
  const Arrow = ({direction, onClick}: { direction: 'prev' | 'next'; onClick: () => void }) => {
    return (
      images.length > 1 && (
        <div
          className={direction === 'prev' ? s.customPrevArrow : s.customNextArrow}
          onClick={onClick}
        >
          {direction === 'prev' ? <ArrowIosBack/> : <ArrowIosForward/>}
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
    prevArrow: <Arrow direction="prev" onClick={() => {
    }}/>,
    nextArrow: <Arrow direction="next" onClick={() => {
    }}/>,
    adaptiveHeight: true,
  }

  return (
    <div>
      <div className={s.sliderWrapper}>
        <Slider
          {...settings}
          className={className ? className : ''}
          dotsClass={dotClass ? dotClass : 'slick-dots'}
        >
          {images?.map(imgSrc => (
            <div key={imgSrc} className={s.slide}>
              <Image
                src={imgSrc}
                alt="post images"
                width={492}
                height={504}
                className={imgClass || ''}
                onClick={handleClick}
                style={{filter: appliedFilter}}
              />
            </div>
          ))}
        </Slider>
      </div>
    </div>
  )
}

export default PhotoSlider
