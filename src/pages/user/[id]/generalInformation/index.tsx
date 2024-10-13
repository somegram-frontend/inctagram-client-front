'use client'
import ProfileForm from './profileForm/ProfileForm'
import { useGetProfileQuery, useProfileFillInfoMutation } from '@/api/users-api'

import s from './generalInformation.module.scss'
import UploadAvatar from '../../uploadAvatar'
import NavigationLayout from '@/components/layout/NavigationLayout'
import { Loader } from '@/components/loader/Loader'
import { ProfileResponse, UserProfile } from '@/api/users-api.types'
import { format } from 'date-fns'
import { toast } from 'react-toastify'
import { useRouter } from 'next/router'

const GeneralInformation = () => {
  const router = useRouter()
  const [
    profileFillInfo,
    { isLoading: isLoadingUpdate, isSuccess: success, error, isError: isErrorUpdate },
  ] = useProfileFillInfoMutation()
  const { data, isLoading, isSuccess, isError: isErrorGet } = useGetProfileQuery()

  const onSubmitProfileForm = async (
    formData: Omit<UserProfile, 'dateOfBirth'> & { dateOfBirth: Date }
  ) => {
    const data = { ...formData, dateOfBirth: format(formData.dateOfBirth, 'dd.MM.yyyy') }
    await profileFillInfo(data)
  }

  if (isLoading)
    return (
      <div className={s.loader}>
        <Loader />
      </div>
    )

  if (isErrorGet || isErrorUpdate) {
    const err = error as { data: ProfileResponse }
    if (err?.data?.errors) {
      const errorMessages = err?.data?.errors
        .map(e => Object.values(e.constraints).join(', '))
        .join('; ')
      errorMessages && toast.error(errorMessages)
    }
    if (isErrorGet) {
      router.push(`/user/`)
    }
  }

  if (success && !toast.isActive('toast-id'))
    toast.success('Changes saved successfully.', { toastId: 'toast-id' })

  if (isSuccess)
    return (
      <NavigationLayout isAuth={true}>
        <div className={s.wrapper}>
          <UploadAvatar />
          <ProfileForm
            onSubmit={onSubmitProfileForm}
            dataValue={{ ...data, dateOfBirth: new Date(data.dateOfBirth) }}
            isLoadingUpdate={isLoadingUpdate}
          />
        </div>
      </NavigationLayout>
    )
}

export default GeneralInformation
