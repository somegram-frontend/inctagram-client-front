import { useGetProfileQuery, useUploadAvatarMutation } from '@/api/users-api'
import s from './uploadAvatar.module.scss'
import { ChangeEvent, FormEvent, useRef, useState } from 'react'
import { Button } from '@honor-ui/inctagram-ui-kit'
import { DialogTrigger, Dialog, DialogContent } from '@/components/dialog/Dialog'

const UploadAvatar = () => {
  const [uploadPhoto] = useUploadAvatarMutation()
  const [photo, setPhoto] = useState<File | null>(null)
  //   const { data } = useGetProfileQuery()

  const uploadHandler = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.currentTarget.files && e.currentTarget.files.length) {
      const file = e.currentTarget.files[0]
      console.log('file: ', file)
      setPhoto(file)
    }
  }

  const submitHandler = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!photo) {
      return
    }
    uploadPhoto({ file: photo })
  }

  return (
    <Dialog>
      <DialogTrigger asChild className={s.triggerButton}>
        <Button>Add a Profile photo</Button>
      </DialogTrigger>
      <DialogContent title={'Upload avatar'}>
        <div className={s.wrapper}>
          <div className={s.uploadPhoto}>
            <form onSubmit={submitHandler}>
              <label className={s.inputFile}>
                <input type="file" name="avatar_upload" accept="image/*" onChange={uploadHandler} />
                {/* <Button>Select from Computer</Button> */}
              </label>
              <input type="submit" />
              {/* <Button>Save</Button> */}
            </form>
            <img />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default UploadAvatar
