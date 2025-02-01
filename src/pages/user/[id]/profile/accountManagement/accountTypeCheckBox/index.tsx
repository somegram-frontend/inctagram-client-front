import React from 'react'
import s from './accountTypeCheckBox.module.scss'
import {Typography} from '@honor-ui/inctagram-ui-kit'
import {AccountType} from '@/pages/user/[id]/profile/accountManagement'
import {useTranslation} from "@/shared/hooks";

type Props = {
  accountType: AccountType
  handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void
}

const AccountTypeCheckBox = ({accountType, handleChange}: Props) => {
  const t = useTranslation('accountManagement')
  return (
    <div className={s.accountType}>
      <Typography variant={'h2'}>{t.accountType}:</Typography>
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
          <div>{t.personal}</div>
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
          <div>{t.business}</div>
        </div>
      </div>
    </div>
  )
}

export default AccountTypeCheckBox
