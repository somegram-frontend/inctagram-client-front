'use client'
import ProfileForm, { FormChangeGeneralInformation } from './profileForm/ProfileForm'
import { useGetProfileQuery, useProfileFillInfoMutation } from '@/api/users-api'

import s from './generalinformation.module.scss'
import UploadAvatar from '../../uploadAvatar'
import NavigationLayout from '@/components/layout/NavigationLayout'

const GeneralInformation = () => {
  const [profileFillInfo] = useProfileFillInfoMutation()
  const { data: profileData } = useGetProfileQuery()

  const onSubmitProfileForm = async (formData: FormChangeGeneralInformation) => {
    await profileFillInfo(formData)
    console.log(formData)
  }

  return (
    <NavigationLayout isAuth={true}>
      <div className={s.wrapper}>
        <UploadAvatar />
        <ProfileForm onSubmit={onSubmitProfileForm} defaultDataValue={profileData} />
      </div>
    </NavigationLayout>
  )
}

export default GeneralInformation
