import { Button, Cards, Typography } from "@honor-ui/inctagram-ui-kit"
import s from './createNewPassword.module.scss'
import { ControlledInput } from "@/components/controlled/ControlledInput"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRestorePasswordConfirmationMutation } from "@/api/auth-api"
import { useRouter } from "next/router"
import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"

const createNewPasswordSchema = z
  .object({
    newPassword: z
      .string()
      .min(6, { message: 'Password must be at least 6 characters' })
      .regex(
        /^(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])(?=.*[!"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~])[0-9A-Za-z!"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~]+$/,
        {
          message:
            'Password must include at least one uppercase letter, one lowercase letter, one number, and one special character.',
        }
      )
      .max(20, { message: 'The field must not contain more than 20 characters' }),
    confirmPassword: z.string(),
  })

export type FormCreateNewPassword = z.infer<typeof createNewPasswordSchema>


const CreateNewPassword = () => {

  const { control, trigger, handleSubmit } = useForm<FormCreateNewPassword>({
    resolver: zodResolver(createNewPasswordSchema),
    defaultValues: {
      newPassword: '',
      confirmPassword: ''
    }
  })

  const [createNewPass, { isLoading }] = useRestorePasswordConfirmationMutation()
  const router = useRouter()
  const searchParams = useSearchParams();
  const recoveryCode = decodeURIComponent(searchParams.get('code') ?? '').replace(/\s+/g, '+')

  console.log(recoveryCode)

  const onSubmit = (data: any) => {
    createNewPass({ code: recoveryCode, password: data.newPassword })
      .unwrap()
      .then(() => {
        router.push('/auth/signIn')
      })
  }

  return (
    <Cards className={s.card}>
      <Typography as={'h1'} className={s.title}>
        Create New Password
      </Typography>
      <form className={s.form} onSubmit={handleSubmit(onSubmit)}>
        <div className={s.inputWrapper}>
          <ControlledInput
            control={control}
            label={'New password'}
            name={'newPassword'}
            trigger={trigger}
            className={s.input} />
          <ControlledInput
            control={control}
            label={'Password confirmation'}
            name={'confirmPassword'}
            trigger={trigger}
            className={s.input} />
        </div>
        <Typography as={'p'} variant={'regular_text14'} className={s.informTitle}>
          Your password must be between 6 and 20 characters
        </Typography>
        <Button fullWidth>Create new password</Button>
      </form>
    </Cards>
  )
}

export default CreateNewPassword
