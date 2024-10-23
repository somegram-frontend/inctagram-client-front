import {
  ArrowIosBack,
  ArrowIosForward,
  Button,
  Close,
  ImageOutline,
  PlusCircleOutline,
  PlusSquareOutline,
  Select,
  TextArea,
  Typography,
} from '@honor-ui/inctagram-ui-kit'
import { Dialog, DialogContent, DialogTrigger } from '../dialog/Dialog'
import s from './dialogAddUserPost.module.scss'
import style from '../../pages/auth/logOut/logOut.module.scss'
import { ChangeEvent, useMemo, useState } from 'react'
import Image from 'next/image'
import { useAddUserPostsMutation } from '@/api/posts-api'
import { PinOutline } from '@honor-ui/inctagram-ui-kit'
import { useGetProfileQuery } from '@/api/users-api'
import { useGetCountriesListQuery } from '@/api/countries-api'

import Slider from 'react-slick'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'

const DialogAddUserPost = () => {
  const [sendPost] = useAddUserPostsMutation()
  const profileInfo = useGetProfileQuery()
  const { data, error, isLoading } = useGetCountriesListQuery()

  const [open, setOpen] = useState(false)
  const [files, setFiles] = useState<File[]>([])
  const [errorUpload, setErrorUpload] = useState('')
  const [publicPost, setPublicPost] = useState(false)
  const [description, setDescription] = useState('')
  const [images, setImages] = useState<string[]>([])

  const maxChars = 500

  const optionsCountry = useMemo(() => {
    if (data && !isLoading && !error) {
      return data.data.map(country => ({
        label: country.country,
        value: country.country,
      }))
    }
    return []
  }, [data, isLoading, error])

  const handleUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const uploadedFiles = e.currentTarget.files
    if (uploadedFiles) {
      const newFiles = Array.from(uploadedFiles)
      validateFiles(newFiles)
    }
  }

  const validateFiles = (uploadedFiles: File[]) => {
    const validFiles: File[] = []
    for (const file of uploadedFiles) {
      if (file.size > 10000000) {
        resetFile('Error! Photo size must be less than 10 MB!')
        return
      } else if (!['image/jpeg', 'image/png'].includes(file.type)) {
        resetFile('Error! The format of the uploaded photo must be PNG or JPEG')
        return
      }
      validFiles.push(file)
    }
    setFiles(prevFiles => [...prevFiles, ...validFiles])
    setImages(prevImages => [...prevImages, ...validFiles.map(file => URL.createObjectURL(file))])
    setErrorUpload('')
  }

  const resetFile = (errorMessage: string) => {
    setImages([])
    setErrorUpload(errorMessage)
  }

  const handlePublish = () => {
    if (files.length > 0) {
      sendPost({ files, description })
      resetPostState()
    }
  }

  const resetPostState = () => {
    setFiles([])
    setImages([])
    setPublicPost(false)
    setDescription('')
    setOpen(false)
  }

  const removeImage = (index: number) => {
    const updatedImages = [...images]
    const updatedFiles = [...files]
    updatedImages.splice(index, 1)
    updatedFiles.splice(index, 1)
    setImages(updatedImages)
    setFiles(updatedFiles)
  }

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
    vertical: false,
    adaptiveHeight: true,
  }

  return (
    <div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger className={style.triggerButton}>
          <PlusSquareOutline /> Create
        </DialogTrigger>
        {images.length === 0 ? (
          <DialogContent title={'Add Photo'}>
            <div className={s.uploadPhotoErrorContainer}>
              {errorUpload && <span className={s.uploadPhotoError}>{errorUpload}</span>}
            </div>
            <div className={s.wrapper}>
              <div className={s.defaultImageContainer}>
                <ImageOutline />
              </div>
              <label className={s.inputFile}>
                <input
                  type="file"
                  name="photo_upload"
                  accept="image/*"
                  onChange={handleUpload}
                  multiple
                />
                <div className={s.btnWrapper}>
                  <Button as="span" className={s.PhotoBtn}>
                    Select from Computer
                  </Button>
                  <Button variant="outlined">Open Draft</Button>
                </div>
              </label>
            </div>
          </DialogContent>
        ) : (
          <DialogContent
            customTitle={'Cropping'}
            customBtn={'Next'}
            onCustomBtnClickGo={() => setPublicPost(true)}
            onCustomBtnClickBack={() => setImages([])}
          >
            <div className={s.wrapperCropping}>
              {images.length > 0 && (
                <div className={s.sliderWrapper}>
                  <Slider {...settings}>
                    {images.map((image, index) => (
                      <div key={index} className={s.slide}>
                        <Image
                          src={image}
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
                <div className={s.addPhotoContainer}>
                  <label className={s.inputFile}>
                    <input
                      type="file"
                      name="photo_upload"
                      accept="image/*"
                      onChange={handleUpload}
                      multiple
                    />
                    <div className={s.btnWrapper}>
                      <Button as="span" className={s.CircleBtn} variant="borderless">
                        <PlusCircleOutline />
                      </Button>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          </DialogContent>
        )}
        {publicPost && (
          <DialogContent
            customTitle={'Publication'}
            customBtn={'Publish'}
            onCustomBtnClickGo={handlePublish}
            onCustomBtnClickBack={() => setPublicPost(false)}
          >
            <div className={s.publicWrapper}>
              <div className={s.sliderWrapper}>
                <Slider {...settings}>
                  {images.map((image, index) => (
                    <div key={index} className={s.slide}>
                      <Image
                        src={image}
                        alt={`Image ${index}`}
                        width={492}
                        height={504}
                        className={s.photo}
                      />
                    </div>
                  ))}
                </Slider>
              </div>
              <div className={s.descriptionContainer}>
                <div className={s.userWrapper}>
                  <Image
                    src={profileInfo.data?.avatar.url || ''}
                    className={s.avatar}
                    alt=""
                    width={100}
                    height={100}
                  />
                  <Typography as={'p'} variant={'bold_text16'} className={s.username}>
                    {profileInfo.data?.userName}
                  </Typography>
                </div>
                <div className={s.textAreaWrapper}>
                  <TextArea
                    label={'Add publication descriptions'}
                    name={'descriptions'}
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    maxLength={maxChars}
                    className={s.TextArea}
                  />
                  <Typography variant={'small_text'} className={s.counter}>
                    {description.length}/{maxChars}
                  </Typography>
                </div>
                <hr className={s.line} />
                <div className={s.selectWrapper}>
                  <Select
                    label={'Add location'}
                    name={'location'}
                    options={optionsCountry}
                    className={s.select}
                  />
                  <span className={s.customArrow}>
                    <PinOutline />
                  </span>
                </div>
              </div>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </div>
  )
}

export default DialogAddUserPost
