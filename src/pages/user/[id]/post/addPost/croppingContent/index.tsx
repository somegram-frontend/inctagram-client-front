import {
  Button,
  Close,
  ExpandOutline,
  Image as FilledImg,
  ImageOutline,
  MaximizeOutline,
  PlusCircleOutline,
} from '@honor-ui/inctagram-ui-kit'
import Img from 'next/image'
import { useState } from 'react'
import type { Image } from '..'
import PhotoSlider from '../../../../../../components/photoSlider'
import style from '../addPost.module.scss'
import { AspectRatioMenu } from './CropMenus/AspectRatioMenu/AspectRatioMenu'
import s from './croppingContent.module.scss'

type Props = {
  images: Array<Image>
  handleUpload: (e: React.ChangeEvent<HTMLInputElement>) => void
  removeImage: (index: number) => void
  onUpdateImage: (imageIdx: number, updatedImage: Image) => void
  getImageUrls: (images: Array<Image>) => Array<string>
}

enum Status {
  idle = 'idle',
  resizing = 'resizing',
  scaling = 'scaling',
  selectingMoreImgs = 'selectingMoreImgs',
}

const statusIconMap = {
  [Status.resizing]: <ExpandOutline />,
  [Status.scaling]: <MaximizeOutline />,
  [Status.selectingMoreImgs]: <ImageOutline />,
}

const CroppingContent: React.FC<Props> = ({
  images,
  handleUpload,
  removeImage,
  onUpdateImage,
  getImageUrls,
}) => {
  const [status, setStatus] = useState<Status>(Status.idle)
  const [prevImages, setPrevImages] = useState<Array<Image>>(images)
  const [activeImgIdx, setActiveImgIdx] = useState(0)

  if (images.length > prevImages.length) {
    setPrevImages(images)
    return null
  }

  if (images.length < prevImages.length) {
    setPrevImages(images)

    let deletedImgIdx!: number
    prevImages.forEach((img, idx) => {
      if (!images.includes(img)) {
        deletedImgIdx = idx
      }
    })

    if (deletedImgIdx < activeImgIdx) {
      setActiveImgIdx(activeImgIdx - 1)
    } else if (deletedImgIdx === activeImgIdx) {
      if (prevImages[deletedImgIdx + 1]) {
        setActiveImgIdx(deletedImgIdx)
      } else {
        setActiveImgIdx(deletedImgIdx - 1)
      }
    }
    return null
  }

  const updateImageCallback = (updatedImage: Image) => {
    onUpdateImage(activeImgIdx, updatedImage)
  }

  const onSetActiveImageIdx = (nextIdx: number) => {
    setActiveImgIdx(nextIdx)
  }

  const handleStatusChange = (nextStatus: Status) => {
    setStatus(prev => (prev === nextStatus ? Status.idle : nextStatus))
  }

  let content

  if (status === Status.selectingMoreImgs) {
    content = (
      <div className={s.photoContainer}>
        {images.map((image, index) => (
          <div
            key={index}
            className={
              index === activeImgIdx ? s.imageWrapper + ' ' + s.activeImage : s.imageWrapper
            }
          >
            <Img
              src={image.url}
              className={s.minPhoto}
              alt={`Image ${index}`}
              width={80}
              height={82}
            />
            <button className={s.removeButton} onClick={() => removeImage(index)}>
              <Close />
            </button>
          </div>
        ))}
        <div>
          <label className={style.inputFile}>
            <input
              type="file"
              name="photo_upload"
              accept="image/*"
              onChange={handleUpload}
              multiple
            />
            <div className={style.btnWrapper}>
              {images.length < 10 && (
                <Button as="span" className={s.circleBtn} variant="borderless">
                  <PlusCircleOutline />
                </Button>
              )}
            </div>
          </label>
        </div>
      </div>
    )
  } else if (status === Status.resizing) {
    content = (
      <AspectRatioMenu onUpdateImage={updateImageCallback} activeImage={images[activeImgIdx]} />
    )
  } else if (status === Status.scaling) {
    content = null
  } else {
    content = null
  }

  let JSXbuttons: Array<JSX.Element> = []
  Object.values(Status).forEach(enumStatus => {
    if (enumStatus !== 'idle') {
      const activeButton = status === enumStatus
      JSXbuttons.push(
        <button
          key={enumStatus}
          className={activeButton ? s.activeButton : ''}
          onClick={() => handleStatusChange(enumStatus)}
        >
          {status === Status.selectingMoreImgs && activeButton ? (
            <FilledImg />
          ) : (
            statusIconMap[enumStatus]
          )}
        </button>
      )
    }
  })

  const imageUrls = getImageUrls(images)

  return (
    <>
      <div className={s.wrapperCropping}>
        <PhotoSlider
          images={imageUrls}
          onSetActiveImageIdx={onSetActiveImageIdx}
          activeImageIdx={activeImgIdx}
        />
        {content}
        <div className={s.imageModificationMenuButtonsContainer}>{JSXbuttons}</div>
      </div>
    </>
  )
}

export default CroppingContent
