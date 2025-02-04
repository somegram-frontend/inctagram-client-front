'use client'
import s from './profile.module.scss'
import Layout from '@/layout'
import {Tabs} from '@honor-ui/inctagram-ui-kit'
import {useEffect, useState} from 'react'
import AccountManagement from './accountManagement'
import MyPayments from './MyPayments'
import {useTranslation} from '@/shared/hooks'
import GeneralInformation from './generalInformation/GeneralInformation'

const Profile = () => {
  const t = useTranslation()
  const [activeTab, setActiveTab] = useState(t.generalInformation.title)


  useEffect(() => {
    const savedTab = localStorage.getItem('activeTab')
    if (savedTab) {
      setActiveTab(savedTab)
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('activeTab', activeTab)
  }, [activeTab])

  const tabsName = [
    {
      text: t.generalInformation.title,
      value: 'General information',
      content: <GeneralInformation/>,
    },
    {text: t.devices.title, value: 'Devices', content: <div>Devices content</div>},
    {
      text: t.accountManagement.title,
      value: 'Account Management',
      content: <AccountManagement/>,
    },
    {text: t.myPayments.title, value: 'My payments', content: <MyPayments/>},
  ]

  const handleValueChange = (value: string) => {
    setActiveTab(value)
  }


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
