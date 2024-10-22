import {
  Button,
  ImageOutline,
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

const DialogAddUserPost = () => {
  const [sendPost] = useAddUserPostsMutation()
  const profileInfo = useGetProfileQuery()
  const { data, error, isLoading } = useGetCountriesListQuery()

  const [open, setOpen] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [photo, setPhoto] = useState('')
  const [errorUpload, setErrorUpload] = useState('')
  const [publicPost, setPublicPost] = useState(false)
  const [description, setDescription] = useState('')

  const maxChars = 500

  const handleUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.currentTarget.files?.[0]
    if (uploadedFile) {
      validateFile(uploadedFile)
    }
  }

  const validateFile = (file: File) => {
    if (file.size > 10000000) {
      resetFile('Error! Photo size must be less than 10 MB!')
    } else if (!['image/jpeg', 'image/png'].includes(file.type)) {
      resetFile('Error! The format of the uploaded photo must be PNG or JPEG')
    } else {
      setFile(file)
      setErrorUpload('')
      const downloadUrl = URL.createObjectURL(new Blob([file], { type: 'image/jpeg' }))
      setPhoto(downloadUrl)
    }
  }

  const resetFile = (errorMessage: string) => {
    setPhoto('')
    setErrorUpload(errorMessage)
  }

  const optionsCountry = useMemo(() => {
    if (data && !isLoading && !error) {
      return data.data.map(country => ({
        label: country.country,
        value: country.country,
      }))
    }
    return []
  }, [data, isLoading, error])

  const handlePublish = () => {
    if (file) {
      sendPost({ files: [file], description })
      resetPostState()
    }
  }

  const resetPostState = () => {
    setPhoto('')
    setPublicPost(false)
    setDescription('')
    setOpen(false)
  }

  return (
    <div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger className={style.triggerButton}>
          <PlusSquareOutline /> Create
        </DialogTrigger>
        {!photo ? (
          <DialogContent title={'Add Photo'}>
            <div className={s.uploadPhotoErrorContainer}>
              {errorUpload && <span className={s.uploadPhotoError}>{errorUpload}</span>}
            </div>
            <div className={s.wrapper}>
              <div className={s.defaultImageContainer}>
                <ImageOutline />
              </div>
              <label className={s.inputFile}>
                <input type="file" name="photo_upload" accept="image/*" onChange={handleUpload} />
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
            onCustomBtnClickBack={() => setPhoto('')}
          >
            <div className={s.wrapper}>
              <div className={s.photoContainer}>
                <Image src={photo} className={s.photo} alt="" width={492} height={504} />
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
              <div className={s.photoContainer}>
                <Image src={photo} className={s.photo} alt="" width={492} height={504} />
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
