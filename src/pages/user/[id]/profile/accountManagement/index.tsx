import React, { useState } from 'react'
import { AccountTypeCheckBox } from './accountTypeCheckBox'
import { AccountSubsCosts } from '@/pages/user/[id]/profile/accountManagement/accountSubsCosts'

export type AccountType = 'Personal' | 'Business'

export const AccountManagement = () => {
  const [accountType, setAccountType] = useState<AccountType>('Personal')

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAccountType(event.target.value as AccountType)
  }

  return (
    <>
      <AccountTypeCheckBox accountType={accountType} handleChange={handleChange} />
      {accountType === 'Business' && <AccountSubsCosts />}
    </>
  )
}
