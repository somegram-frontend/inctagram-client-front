import React from 'react'
import s from './GeneralInformation.module.scss'
import UploadAvatar from '@/pages/user/[id]/profile/uploadProfileAvatar'
import ProfileForm from '@/pages/user/[id]/profile/profileForm'
import { useGetProfileQuery, useProfileFillInfoMutation } from '@/api/user/users-api'
import { ProfileResponse, UserProfile } from '@/api/user/users-api.types'
import { format } from 'date-fns'
import { Loader } from '@/components/loader'
import { toast } from 'react-toastify'
import { useRouter } from 'next/router'

const GeneralInformation = () => {
  const router = useRouter()

  const [
    profileFillInfo,
    { isLoading: isLoadingUpdate, isSuccess: success, error, isError: isErrorUpdate },
  ] = useProfileFillInfoMutation()
  const { data, isLoading, isError: isErrorGet } = useGetProfileQuery()

  const onSubmitProfileForm = async (formData: UserProfile) => {
    let formattedDateOfBirth: string | undefined
    if (formData.dateOfBirth) {
      try {
        formattedDateOfBirth = format(new Date(formData.dateOfBirth), 'dd.MM.yyyy')
      } catch (error) {
        console.error('Invalid date format:', error)
        return
      }
    }
    await profileFillInfo({ ...formData, dateOfBirth: formattedDateOfBirth || '' })
  }

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
    toast.success('Your settings are saved!', { toastId: 'toast-id' })

  if (isLoading)
    return (
      <div className={s.loader}>
        <Loader />
      </div>
    )

  return (
    <section className={s.avatarAndForm}>
      <UploadAvatar />
      <ProfileForm
        dataValue={data}
        onSubmit={onSubmitProfileForm}
        isLoadingUpdate={isLoadingUpdate}
      />
    </section>
  )
}

export default GeneralInformation
