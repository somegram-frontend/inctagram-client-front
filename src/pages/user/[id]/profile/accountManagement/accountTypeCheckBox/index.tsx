import React from 'react'
import s from './accountTypeCheckBox.module.scss'
import { Typography } from '@honor-ui/inctagram-ui-kit'
import { AccountType } from '@/pages/user/[id]/profile/accountManagement'

type Props = {
  accountType: AccountType
  handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void
}

const AccountTypeCheckBox = ({ accountType, handleChange }: Props) => {
  return (
    <div className={s.accountType}>
      <Typography variant={'h2'}>Account type:</Typography>
      <div className={s.wrapper}>
        <div className={s.checkBoxTitle}>
          <input
            className={s.radioButton}
            type="radio"
            name="accountType"
            value="Personal"
            checked={accountType === 'Personal'}
            onChange={handleChange}
          />
          <div>Personal</div>
        </div>

        <div className={s.checkBoxTitle}>
          <input
            className={s.radioButton}
            type="radio"
            name="accountType"
            value="Business"
            checked={accountType === 'Business'}
            onChange={handleChange}
          />
          <div>Business</div>
        </div>
      </div>
    </div>
  )
}

export default AccountTypeCheckBox
