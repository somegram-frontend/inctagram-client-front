import React, { useState } from 'react'
import AccountTypeCheckBox from './accountTypeCheckBox'
import AccountSubsCosts from './accountSubsCosts'

export type AccountType = 'Personal' | 'Business'

const AccountManagement = () => {
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

export default AccountManagement
