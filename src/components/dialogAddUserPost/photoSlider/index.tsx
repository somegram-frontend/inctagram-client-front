import React from 'react'
import Slider from 'react-slick'
import s from './photoSlider.module.scss'
import { ArrowIosBack, ArrowIosForward } from '@honor-ui/inctagram-ui-kit'
import Image from 'next/image'

type Props = {
  image: string[]
}

const PhotoSlider: React.FC<Props> = ({ image }) => {
  const Arrow = ({ direction, onClick }: { direction: 'prev' | 'next'; onClick: () => void }) => (
    <div className={direction === 'prev' ? s.customPrevArrow : s.customNextArrow} onClick={onClick}>
      {direction === 'prev' ? <ArrowIosBack /> : <ArrowIosForward />}
    </div>
  )

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    prevArrow: <Arrow direction="prev" onClick={() => {}} />,
    nextArrow: <Arrow direction="next" onClick={() => {}} />,
    adaptiveHeight: true,
  }

  return (
    <div>
      {image.length > 0 && (
        <div className={s.sliderWrapper}>
          <Slider {...settings}>
            {image.map((imgSrc, index) => (
              <div key={index} className={s.slide}>
                <Image
                  src={imgSrc}
                  alt={`Image ${index}`}
                  width={492}
                  height={504}
                  className={s.photo}
                />
              </div>
            ))}
          </Slider>
        </div>
      )}
    </div>
  )
}

export default PhotoSlider
