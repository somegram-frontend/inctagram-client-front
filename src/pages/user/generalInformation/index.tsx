'use client'
import ProfileForm, { FormChangeGeneralInformation } from './profileForm/ProfileForm'

import s from './generalinformation.module.scss'

const GeneralInformation = () => {

  const onSubmitProfileForm = async (formData: FormChangeGeneralInformation) => {
    console.log('test')
    console.log(formData)
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
