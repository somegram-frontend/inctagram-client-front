import { useUploadAvatarMutation } from '@/api/users-api'
import s from './uploadAvatar.module.scss'
import { ChangeEvent, FormEvent, useState } from 'react'
import { Button, ImageOutline } from '@honor-ui/inctagram-ui-kit'
import { DialogTrigger, Dialog, DialogContent, DialogClose } from '@/components/dialog/Dialog'

const UploadAvatar = () => {
  const [uploadPhoto] = useUploadAvatarMutation()
  const [photo, setPhoto] = useState<File | null>(null)
  const [ava, setAva] = useState('')
  const [open, setOpen] = useState(false)

  const uploadHandler = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.currentTarget.files && e.currentTarget.files.length) {
      const file = e.currentTarget.files[0]
      console.log(file)
      if (file.size > 10000000) {
        setAva('')
        console.log('file size is to big')
      } else if (file.type !== 'image/jpeg' && file.type !== 'image/png') {
        setAva('')
        console.log('incorrect file type')
      } else {
        setPhoto(file)
        const blob = new Blob([file], { type: 'image/jpeg' })
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
    uploadPhoto({ file: photo })
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild className={s.triggerButton}>
        <Button>Add a Profile photo</Button>
      </DialogTrigger>
      <DialogContent title={'Upload avatar'}>
        <div className={s.wrapper}>
          <div className={s.uploadPhoto}>
            <form onSubmit={submitHandler}>
              <label className={s.inputFile}>
                <input
                  type="file"
                  name="avatar_upload"
                  // accept="image/jpeg, image/png"
                  accept="image/*"
                  onChange={uploadHandler}
                />
              </label>
              <input type="submit" />
            </form>
            {ava ? <img src={ava} /> : <ImageOutline />}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default UploadAvatar
