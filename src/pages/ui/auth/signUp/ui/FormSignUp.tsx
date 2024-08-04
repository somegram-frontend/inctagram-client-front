// use 'client'
import Image from 'next/image'
import { useId } from 'react'
import { useForm } from 'react-hook-form'
import Link from 'next/link'
import { Button, Typography, Cards, Checkbox } from '@honor-ui/inctagram-ui-kit'
import '@honor-ui/inctagram-ui-kit/css'
import github from './GitHub.png'
import google from './Google.png'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

import s from './formSignUp.module.scss'

type Props = {
  onSubmit: (data: SignUpForm) => void
}

const loginSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'This field has to be filled.' })
    .email('This is not a valid email.'),
  password: z
    .string()
    .min(4, { message: 'Password must be at least 4 characters' })
    .max(30, { message: 'The field must not contain more than 30 characters' }),
  rememberMe: z.boolean().optional(),
})

export type SignUpForm = z.infer<typeof loginSchema>
export const FormSignUp = ({ onSubmit }: Props) => {
  const { control, handleSubmit } = useForm<SignUpForm>({ resolver: zodResolver(loginSchema) })
  const formId = useId()

  return (
    <Cards className={s.card}>
      <Typography as={'h1'} className={s.title}>
        Sign Up
      </Typography>
      <div className={s.iconsBlock}>
        <Image src={google} alt="google" /> {/*TODO change to Google component from library*/}
        <Image src={github} alt="github" /> {/*TODO change to GitHub component from library*/}
      </div>
      <form className={s.form} id={formId} onSubmit={handleSubmit(onSubmit)}>
        <div className={s.containerInput}>Жду контролируемые инпуты и чекбокс</div>
        <div className={s.containerCheckbox}>
          {/*<ControlledCheckbox control={control} label={'Remember me'} name={'rememberMe'} />*/}
          <Checkbox name={'agree'} id="agree" />
          <Typography as={'label'} htmlFor={'agree'} variant={'small_text'}>
            I agree to the{' '}
            <Typography as={Link} href={'/ui/auth/signUp/termsOfService'} variant={'small_link'}>
              Terms of Service
            </Typography>
            {' and '}
            <Typography as={Link} href={'/ui/auth/signUp/privacyPolicy'} variant={'small_link'}>
              Privacy Policy
            </Typography>
          </Typography>
        </div>
        <Button form={formId} fullWidth>
          Sign Up
        </Button>
      </form>
      <Typography as={'h2'} className={s.registration} variant={'medium_text14'}>
        Do you have an account?
      </Typography>
      <Typography as={Link} className={s.signIn} href={'/ui/auth/signIn'} variant={'regular_link'}>
        Sign In
      </Typography>
    </Cards>
  )
}

FormSignUp.displayName = 'FormSignUp'
