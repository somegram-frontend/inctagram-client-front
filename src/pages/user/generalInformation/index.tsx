'use client'
import ProfileForm, { FormChangeGeneralInformation } from './profileForm/ProfileForm'

import s from './generalinformation.module.scss'
import { useProfileFillInfoMutation } from '@/api/users-api';

const GeneralInformation = () => {
  const [profileFillInfo] = useProfileFillInfoMutation()

  const onSubmitProfileForm = async (formData: FormChangeGeneralInformation) => {
    console.log('test')
    console.log(formData)
    await profileFillInfo(formData)
  }

  return (
    <div className={s.wrapper}>
      <div className={s.uploadPhoto}>photo</div>
      <ProfileForm
        onSubmit={onSubmitProfileForm} />
    </div>
  )
}

export default GeneralInformation
