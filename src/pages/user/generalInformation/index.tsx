'use client'
import ProfileForm, { FormChangeGeneralInformation } from './profileForm/ProfileForm'

import s from './generalinformation.module.scss'

const GeneralInformation = () => {

  const onSubmitProfileForm = (formData: FormChangeGeneralInformation) => {
    console.log('test')
  }

  return (
    <div className={s.wrapper}>
      <div className={s.uploadPhoto}>photo</div>
      <ProfileForm
        onSubmit={onSubmitProfileForm}
        errorMessage={"Error"} />
    </div>
  )
}

export default GeneralInformation
