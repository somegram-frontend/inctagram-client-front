'use client'
import ProfileForm, { FormChangeGeneralInformation } from './profileForm/ProfileForm'
import { useGetProfileQuery, useProfileFillInfoMutation } from '@/api/users-api'

import s from './generalinformation.module.scss'

const GeneralInformation = () => {
  const [profileFillInfo] = useProfileFillInfoMutation()
  const { data: profileData } = useGetProfileQuery()

  const onSubmitProfileForm = async (formData: FormChangeGeneralInformation) => {
    await profileFillInfo(formData)
    console.log(formData)
  }

  return (
    <div className={s.wrapper}>
      <div className={s.uploadPhoto}>photo</div>
      <ProfileForm onSubmit={onSubmitProfileForm} defaultDataValue={profileData} />
    </div>
  )
}

export default GeneralInformation
