import React from 'react'
import s from '@/pages/user/[id]/profile/accountManagement/accountSubsCosts/accountSubsCosts.module.scss'
import { AccountSubsType } from '@/pages/user/[id]/profile/accountManagement/accountSubsCosts'

type Props = {
  isChecked: boolean
  handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  subValue: string
}

export const CheckBoxTitle = ({ handleChange, subValue, isChecked }: Props) => {
  return (
    <div className={s.checkBoxTitle}>
      <input
        className={s.radioButton}
        type="radio"
        name="costs"
        value={subValue}
        checked={isChecked}
        onChange={handleChange}
      />
      <div>{subValue}</div>
    </div>
  )
}
