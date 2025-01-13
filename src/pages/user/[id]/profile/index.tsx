import ProfileForm from './profileForm'
import {useGetProfileQuery, useProfileFillInfoMutation} from '@/api/user/users-api'
import s from './profile.module.scss'
import UploadAvatar from './uploadProfileAvatar'
import Layout from '@/layout'
import {Loader} from '@/components/loader'
import {ProfileResponse, UserProfile} from '@/api/user/users-api.types'
import {format} from 'date-fns'
import {toast} from 'react-toastify'
import {useRouter} from 'next/router'
import {Tabs} from '@honor-ui/inctagram-ui-kit'
import {useEffect, useState} from 'react'
import {AccountManagement} from '@/pages/user/[id]/profile/accountManagement'
import {useMeQuery} from "@/api/auth/auth-api";

const Profile = () => {
  const [activeTab, setActiveTab] = useState('General information')
  const router = useRouter()

  useEffect(() => {
    const savedTab = localStorage.getItem('activeTab')
    if (savedTab) {
      setActiveTab(savedTab)
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('activeTab', activeTab)
  }, [activeTab])
  const [
    profileFillInfo,
    {isLoading: isLoadingUpdate, isSuccess: success, error, isError: isErrorUpdate},
  ] = useProfileFillInfoMutation()
  const {data, isLoading, isSuccess, isError: isErrorGet} = useGetProfileQuery()

  const onSubmitProfileForm = async (formData: UserProfile) => {
    await profileFillInfo({...formData, dateOfBirth: format(formData.dateOfBirth, 'dd.MM.yyyy')})
  }

  const tabsName = [
    {
      text: 'General information',
      value: 'General information',
      content: (
        <div className={s.avatarAndForm}>
          <UploadAvatar/>
          <ProfileForm
            dataValue={data}
            onSubmit={onSubmitProfileForm}
            isLoadingUpdate={isLoadingUpdate}
          />
        </div>
      ),
    },
    {text: 'Devices', value: 'Devices', content: <div>Devices content</div>},
    {text: 'Account Management', value: 'Account Management', content: <AccountManagement/>},
    {text: 'My payments', value: 'My payments', content: <div>My payments content</div>},
  ]

  const handleValueChange = (value: string) => {
    setActiveTab(value)
  }

  if (isLoading)
    return (
      <div className={s.loader}>
        <Loader/>
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
    toast.success('Your settings are saved!', {toastId: 'toast-id'})

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
