'use client'
import ProfileForm from './profileForm'
import { useGetProfileQuery, useProfileFillInfoMutation } from '@/api/users-api'

import s from './profile.module.scss'
import UploadAvatar from './uploadProfileAvatar'
import Layout from '@/pages/_layout'
import { Loader } from '@/components/loader'
import { ProfileResponse, UserProfile } from '@/api/users-api.types'
import { format } from 'date-fns'
import { toast } from 'react-toastify'
import { useRouter } from 'next/router'

const Profile = () => {
  const router = useRouter()
  const [
    profileFillInfo,
    { isLoading: isLoadingUpdate, isSuccess: success, error, isError: isErrorUpdate },
  ] = useProfileFillInfoMutation()
  const { data, isLoading, isSuccess, isError: isErrorGet } = useGetProfileQuery()

  const onSubmitProfileForm = async (formData: UserProfile) => {
    await profileFillInfo({ ...formData, dateOfBirth: format(formData.dateOfBirth, 'dd.MM.yyyy') })
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
      <Layout isAuth={true}>
        <div className={s.wrapper}>
          <UploadAvatar />
          <ProfileForm
            dataValue={data}
            onSubmit={onSubmitProfileForm}
            isLoadingUpdate={isLoadingUpdate}
          />
        </div>
      </Layout>
    )
}

export default Profile
