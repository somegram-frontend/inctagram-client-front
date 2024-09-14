import { useRouter } from "next/router"
import { restorePasswordArgs } from "@/api/auth-api.types"
import { emailTemplateForgotPassword } from "./emailTemplateForgotPassword"
import { useRestorePasswordMutation } from "@/api/auth-api"
import FormForgotPassword, { FormForgotPasswordType } from "@/pages/ui/auth/forgotPassword/formForgotPassword/formForgotPassword"
import { Dialog, DialogClose, DialogContent, DialogTrigger } from "@/components/dialog/Dialog"
import { useState } from "react"
import { Button } from "@honor-ui/inctagram-ui-kit"
import s from './forgotPassword.module.scss'

const ForgotPassword = () => {
  const router = useRouter()
  const [forgotPass, forgotPasswordResult] = useRestorePasswordMutation()
  const [isModalOpen, setIsModalOpen] = useState(false)
  let email: string
  const onSubmitForgotPassword = (formData: FormForgotPasswordType) => {
    email = formData.email
    const forgotPassword: restorePasswordArgs = {
      email: formData.email,
      recaptchaToken: formData.recaptchaToken,
      html: emailTemplateForgotPassword,
    }
    forgotPass(forgotPassword)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    router.push('/auth/signIn')
    setIsModalOpen(false)
  }

  return (
    <>
      <FormForgotPassword onSubmit={onSubmitForgotPassword} />
      <Dialog open={isModalOpen} onOpenChange={handleCloseModal}>
        <DialogContent title={'Email sent'}>
          <div className={s.main}>
            <span className={s.text}>We have sent a link to confirm your email to {forgotPasswordResult.originalArgs?.email}</span>
            <div className={s.buttonContainer}>
              <DialogClose>
                <Button className={s.button} onClick={handleCloseModal}>OK</Button>
              </DialogClose>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default ForgotPassword
