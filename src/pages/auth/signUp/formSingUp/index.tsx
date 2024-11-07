import { useId } from 'react'
import { useForm } from 'react-hook-form'
import Link from 'next/link'
import { Button, Typography, Cards } from '@honor-ui/inctagram-ui-kit'
import '@honor-ui/inctagram-ui-kit/css'
import { zodResolver } from '@hookform/resolvers/zod'
import { isValid, z } from 'zod'
import { signUpSchema } from '@/shared/const/validationSchemas'
import s from './formSignUp.module.scss'
import { ControlledInput } from '@/components/controlled/ControlledInput'
import { ControlledCheckbox } from '@/components/controlled/ControlledCheckbox'
import { AuthProviders } from '@/pages/auth/authProviders'

type Props = {
  onSubmit: (data: SignUpForm) => void
  onSignGoogle: () => void
  onSignGit: () => void
}

export type SignUpForm = z.infer<typeof signUpSchema>

export const FormSignUp = ({ onSubmit, onSignGit, onSignGoogle }: Props) => {
  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    trigger,
  } = useForm<SignUpForm>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      isAgree: false,
    },
  })
  const formId = useId()

  return (
    <Cards className={s.card}>
      <Typography as={'h1'} className={s.title}>
        Sign Up
      </Typography>
      <AuthProviders onSignGit={onSignGit} onSignGoogle={onSignGoogle} />
      <form className={s.form} id={formId} onSubmit={handleSubmit(onSubmit)}>
        <div className={s.containerInput}>
          <ControlledInput
            control={control}
            label={'Username'}
            name={'username'}
            trigger={trigger}
            className={s.input}
          />
          <ControlledInput
            control={control}
            label={'Email'}
            name={'email'}
            trigger={trigger}
            className={s.input}
          />
          <ControlledInput
            control={control}
            label={'Password'}
            name={'password'}
            trigger={trigger}
            className={s.input}
          />
          <ControlledInput
            control={control}
            label={'Password confirmation'}
            name={'confirmPassword'}
            trigger={trigger}
            className={s.input}
          />
        </div>
        <div className={s.containerCheckbox}>
          <ControlledCheckbox control={control} label={''} name={'isAgree'} trigger={trigger} />
          <Typography as={'span'} variant={'small_text'}>
            I agree to the{' '}
            <Typography as={Link} href={'/auth/signUp/termsOfService'} variant={'small_link'}>
              Terms of Service
            </Typography>
            {' and '}
            <Typography as={Link} href={'/auth/signUp/privacyPolicy'} variant={'small_link'}>
              Privacy Policy
            </Typography>
          </Typography>
        </div>
        <div className={s.err}>
          {errors.isAgree?.message && (
            <Typography variant={'error_text'}>{errors.isAgree?.message}</Typography>
          )}
        </div>
        <Button form={formId} fullWidth disabled={!isValid}>
          Sign Up
        </Button>
      </form>
      <Typography as={'h2'} className={s.registration} variant={'medium_text14'}>
        Do you have an account?
        <Typography as={Link} href={'/auth/signIn'} variant={'regular_link'}>
          Sign In
        </Typography>
      </Typography>
    </Cards>
  )
}

FormSignUp.displayName = 'FormSignUp'
