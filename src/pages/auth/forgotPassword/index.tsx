import { useRouter } from 'next/router'
import { restorePasswordArgs } from '@/api/auth/auth-api.types'
import { emailTemplateForgotPassword } from '../../../shared/templates/emails/emailTemplateForgotPassword'
import { useRestorePasswordMutation } from '@/api/auth/auth-api'
import FormForgotPassword, {
  FormForgotPasswordType,
} from '@/pages/auth/forgotPassword/formForgotPassword'
import { Dialog, DialogClose, DialogContent, DialogTrigger } from '@/components/dialog'
import { useState } from 'react'
import { Button } from '@honor-ui/inctagram-ui-kit'
import s from './forgotPassword.module.scss'

const ForgotPassword = () => {
  const router = useRouter()
  const [forgotPass, { isError }] = useRestorePasswordMutation()
  const [isModalOpen, setIsModalOpen] = useState(false)
  let [email, setEmail] = useState('')

  const onSubmitForgotPassword = async (formData: FormForgotPasswordType) => {
    email = formData.email
    const forgotPassword: restorePasswordArgs = {
      email: formData.email,
      recaptchaToken: formData.recaptchaToken,
      html: emailTemplateForgotPassword,
    }
    setEmail(formData.email)
    const result = await forgotPass(forgotPassword)
    if (!result.error) {
      setIsModalOpen(true)
    }
  }

  const handleCloseModal = () => {
    router.push('/auth/signIn')
    setIsModalOpen(false)
  }

  return (
    <>
      <FormForgotPassword
        onSubmit={onSubmitForgotPassword}
        errorMessage={isError ? "User with this email doesn't exist" : ''}
      />
      <Dialog open={isModalOpen} onOpenChange={handleCloseModal}>
        <DialogContent title={'Email sent'}>
          <div className={s.main}>
            <span className={s.text}>We have sent a link to confirm your email to {email}</span>
            <div className={s.buttonContainer}>
              <DialogClose>
                <Button className={s.button} onClick={handleCloseModal}>
                  OK
                </Button>
              </DialogClose>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default ForgotPassword
