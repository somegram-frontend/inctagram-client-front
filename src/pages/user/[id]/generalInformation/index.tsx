'use client'
import ProfileForm from './profileForm/ProfileForm'
import { useGetProfileQuery, useProfileFillInfoMutation } from '@/api/users-api'

import s from './generalinformation.module.scss'
import UploadAvatar from '../../uploadAvatar'
import NavigationLayout from '@/components/layout/NavigationLayout'
import { Loader } from '@/components/loader/Loader'
import { ProfileResponse, UserProfile } from '@/api/users-api.types'
import { format } from 'date-fns'
import { toast } from 'react-toastify'

const GeneralInformation = () => {
  const [profileFillInfo, { isSuccess: success, error, isError }] = useProfileFillInfoMutation()
  const { data, isLoading, isSuccess } = useGetProfileQuery()

  const onSubmitProfileForm = async (
    formData: Omit<UserProfile, 'dateOfBirth'> & { dateOfBirth: Date }
  ) => {
    const data = { ...formData, dateOfBirth: format(formData.dateOfBirth, 'dd.MM.yyyy') }
    console.log(data)
    await profileFillInfo(data)
  }
  if (isLoading) return <Loader />
  if (isError) {
    const err = error as { data: ProfileResponse }
    if (err.data?.errors) {
      const errorMessages = err.data.errors
        .map(e => Object.values(e.constraints).join(', '))
        .join('; ')
      toast.error(errorMessages)
    } else {
      toast.error(err.data?.message || 'Saved failed')
    }
  }

  if (success) {
    toast.success('Changes saved successfully.')
  }
  if (isSuccess)
    return (
      <NavigationLayout isAuth={true}>
        <div className={s.wrapper}>
          <UploadAvatar />
          <ProfileForm
            onSubmit={onSubmitProfileForm}
            dataValue={{ ...data, dateOfBirth: new Date(data.dateOfBirth) }}
          />
        </div>
      </NavigationLayout>
    )
}

export default GeneralInformation
