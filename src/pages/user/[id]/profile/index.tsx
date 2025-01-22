'use client'
import { useGetProfileQuery, useProfileFillInfoMutation } from '@/api/user/users-api'
import ProfileForm from './profileForm'

import { ProfileResponse, UserProfile } from '@/api/user/users-api.types'
import { Loader } from '@/components/loader'
import Layout from '@/layout'
import { Tabs } from '@honor-ui/inctagram-ui-kit'
import { format } from 'date-fns'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { toast } from 'react-toastify'
import s from './profile.module.scss'
import UploadAvatar from './uploadProfileAvatar'
import { usePathname, useSearchParams } from 'next/navigation'
import MyPayments from './MyPayments'

const Profile = () => {
  const [activeTab, setActiveTab] = useState('General information')
  const searchParams = useSearchParams()
  const pathname = usePathname()

  const router = useRouter()
  const [
    profileFillInfo,
    { isLoading: isLoadingUpdate, isSuccess: success, error, isError: isErrorUpdate },
  ] = useProfileFillInfoMutation()
  const { data, isLoading, isSuccess, isError: isErrorGet } = useGetProfileQuery()

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

  const tabsName = [
    {
      text: 'General information',
      value: 'General information',
      content: (
        <div className={s.avatarAndForm}>
          <UploadAvatar />
          <ProfileForm
            dataValue={data}
            onSubmit={onSubmitProfileForm}
            isLoadingUpdate={isLoadingUpdate}
          />
        </div>
      ),
    },
    { text: 'Devices', value: 'Devices', content: <div>Devices content</div> },
    {
      text: 'Account Management',
      value: 'Account Management',
      content: <div>Account management</div>,
    },
    { text: 'My payments', value: 'My payments', content: <MyPayments /> },
  ]

  const handleValueChange = (value: string) => {
    setActiveTab(value)
    if (activeTab === 'My payments' && searchParams.size) {
      router.replace(pathname)
    }
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
    toast.success('Your settings are saved!', { toastId: 'toast-id' })

  if (isSuccess)
    return (
      <Layout>
        <div className={s.wrapper}>
          <div className={s.tabsContent}>
            <Tabs
              className={s.tabsClass}
              tabs={tabsName}
              onValueChange={handleValueChange}
              value={activeTab}
            />
          </div>
        </div>
      </Layout>
    )
}

export default Profile
