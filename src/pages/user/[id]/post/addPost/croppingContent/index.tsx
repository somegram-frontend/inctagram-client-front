import PhotoSlider from '../../../../../../components/photoSlider'
import style from '../addPost.module.scss'
import s from './croppingContent.module.scss'
import Image from 'next/image'
import { Button, Close, PlusCircleOutline } from '@honor-ui/inctagram-ui-kit'

type Props = {
  images: string[]
  handleUpload: (e: React.ChangeEvent<HTMLInputElement>) => void
  removeImage: (index: number) => void
}

const CroppingContent: React.FC<Props> = ({ images, handleUpload, removeImage }) => {
  return (
    <>
      <div className={s.wrapperCropping}>
        <PhotoSlider images={images} />
        <div className={s.photoContainer}>
          {images.map((image, index) => (
            <div key={index} className={s.imageWrapper}>
              <Image
                src={image}
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
      </div>
    </>
  )
}

export default CroppingContent
