import { useUploadAvatarMutation } from '@/api/users-api'
import s from './generalinformation.module.scss'
import { ChangeEvent, FormEvent, useState } from 'react'

const GeneralInformation = () => {
  const [uploadPhoto] = useUploadAvatarMutation()
  const [photo, setPhoto] = useState<File | null>(null)

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
    <div className={s.wrapper}>
      <div className={s.uploadPhoto}>
        <form onSubmit={submitHandler}>
          <input type="file" name="picture" accept="image/*" onChange={uploadHandler} />
          <input type="submit" />
        </form>
        {/* <img /> */}
        {/* TODO add image from profile */}
      </div>
      <div className={s.fillProfile}>profile</div>
    </div>
  )
}

export default GeneralInformation
