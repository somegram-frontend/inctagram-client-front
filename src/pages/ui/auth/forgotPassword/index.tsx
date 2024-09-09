import { useRouter } from "next/router"
import { restorePasswordArgs } from "@/api/auth-api.types"
import { emailTemplateForgotPassword } from "./emailTemplateForgotPassword"
import { toast } from "react-toastify"
import { useRestorePasswordMutation } from "@/api/auth-api"
import FormForgotPassword, { FormForgotPasswordType } from "./formForgotPassword/formForgotPassword"

const ForgotPassword = () => {
  const router = useRouter()
  const [forgotPass, forgotPasswordResult] = useRestorePasswordMutation()
  let email: string
  const onSubmitForgotPassword = (formData: FormForgotPasswordType) => {
    email = formData.email
    const forgotPassword: restorePasswordArgs = {
      email: formData.email,
      recaptchaToken: formData.recaptchaToken,
      html: emailTemplateForgotPassword,
    }
    console.log(forgotPassword)
    forgotPass(forgotPassword)
  }

  if (forgotPasswordResult.isSuccess) {
    toast.success('Registration completed successfully.\nCheck your email')
    forgotPasswordResult.originalArgs &&
      router.push(
        `/ui/auth/forgotPassword/emailVerification?email=${encodeURIComponent(forgotPasswordResult.originalArgs.email)}`
      )
  }

  return <FormForgotPassword onSubmit={onSubmitForgotPassword} />
}

export default ForgotPassword
