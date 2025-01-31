import {
  useDeleteAvatarMutation,
  useGetProfileQuery,
  useUploadAvatarMutation,
} from '@/api/user/users-api'
import s from './uploadProfileAvatar.module.scss'
import style from '@/pages/auth/logOut/logOut.module.scss'
import {ChangeEvent, FormEvent, useState} from 'react'
import {Button, ImageOutline, CloseOutline} from '@honor-ui/inctagram-ui-kit'
import {DialogTrigger, Dialog, DialogContent, DialogClose} from '@/components/dialog'
import {Loader} from '@/components/loader'
import Image from 'next/image'
import {MAX_AVATAR_IMGE_SIZE_10MB} from '@/shared/const/sizes'
import {useTranslation} from "@/shared/hooks";

const UploadAvatar = () => {
  const [uploadPhoto, {isLoading}] = useUploadAvatarMutation()
  const [deletePhoto] = useDeleteAvatarMutation()
  const {data} = useGetProfileQuery()
  const [photo, setPhoto] = useState<File | null>(null)
  const [ava, setAva] = useState('')
  const [open, setOpen] = useState(false)
  const [openDelete, setOpenDelete] = useState(false)
  const [error, setError] = useState('')
  const t = useTranslation()

  const uploadHandler = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.currentTarget.files && e.currentTarget.files.length) {
      const file = e.currentTarget.files[0]
      if (file.size > MAX_AVATAR_IMGE_SIZE_10MB) {
        setAva('')
        setError('Error! Photo size must be less than 10 MB!')
      } else if (file.type !== 'image/jpeg' && file.type !== 'image/png') {
        setAva('')
        setError('Error! The format of the uploaded photo must be PNG and JPEG')
      } else {
        setPhoto(file)
        setError('')
        const blob = new Blob([file], {type: 'image/jpeg'})
        const downloadUrl = window.URL.createObjectURL(blob)
        setAva(downloadUrl)
      }
    }
  }

  const submitHandler = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!photo) {
      return
    }
    uploadPhoto({file: photo})
    setOpen(false)
  }

  const onClickHandler = () => {
    deletePhoto()
    setOpenDelete(false)
    setAva('')
  }
  if (isLoading)
    return (
      <div className={s.loader}>
        <Loader/>
      </div>
    )

  return (
    <div className={s.addProfilePhotoContainer}>
      <div className={s.addProfilePhotoContainer}>
        {data?.avatar?.url ? (
          <div className={s.profileAvaContainer}>
            <Image
              src={data?.avatar.url}
              className={s.profileAvatar}
              alt=""
              width={190}
              height={190}
            />
          </div>
        ) : (
          <div className={s.defaultAvaContainer}>
            <ImageOutline/>
          </div>
        )}
        <Dialog open={openDelete} onOpenChange={setOpenDelete}>
          <DialogTrigger asChild className={style.triggerButton}>
            {data?.avatar?.url && (
              <button className={s.deleteAvaBtn}>
                <CloseOutline/>
              </button>
            )}
          </DialogTrigger>
          <DialogContent title={t.deletePhoto.title}>
            <div className={style.main}>
              <span className={style.text}>{t.deletePhoto.confirmationMessage}</span>
              <div className={style.buttonContainer}>
                <Button onClick={onClickHandler} variant={'outlined'} className={style.button}>
                  {t.common.yes}
                </Button>
                <DialogClose>
                  <Button className={style.button}>{t.common.no}</Button>
                </DialogClose>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild className={s.triggerButton}>
          <Button variant="outlined">{t.generalInformation.addProfilePhoto}</Button>
        </DialogTrigger>
        <DialogContent title={t.uploadAvatar.title}>
          <div className={s.uploadPhotoErrorContainer}>
            {error && <span className={s.uploadPhotoError}>{error}</span>}
          </div>
          <div className={s.wrapper}>
            {ava ? (
              <div className={s.avatarContainer}>
                <Image src={ava} className={s.avatar} alt="" width={190} height={190}/>
              </div>
            ) : (
              <div className={s.defaultImageContainer}>
                <ImageOutline/>
              </div>
            )}
            <form onSubmit={submitHandler}>
              <label className={s.inputFile}>
                <input type="file" name="avatar_upload" accept="image/*" onChange={uploadHandler}/>
                {!ava && (
                  <Button as="span" className={s.selectAvaBtn}>
                    {t.uploadAvatar.selectFromComputer}
                  </Button>
                )}
              </label>
              {ava && (
                <Button type="submit" className={s.saveAvaBtn}>
                  {t.common.save}
                </Button>
              )}
            </form>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default UploadAvatar
