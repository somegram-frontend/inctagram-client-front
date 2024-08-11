'use client'

import { useId } from 'react'
import { useForm } from 'react-hook-form'
import Link from 'next/link'
import {
  GithubSvgrepoCom31 as Github,
  GoogleSvgrepoCom1 as Google,
  Button,
  Typography,
  Cards,
} from '@honor-ui/inctagram-ui-kit'
import '@honor-ui/inctagram-ui-kit/css'
import { zodResolver } from '@hookform/resolvers/zod'
import { isValid, z } from 'zod'

import s from './formSignUp.module.scss'
import { ControlledInput } from '@/components/controlled/ControlledInput'
import { ControlledCheckbox } from '@/components/controlled/ControlledCheckbox'

type Props = {
  onSubmit: (data: SignUpForm) => void
}

const loginSchema = z
  .object({
    username: z
      .string()
      .min(1, { message: 'This field has to be filled.' })
      .min(6, { message: 'Username must be at least 6 characters' })
      .regex(/^[0-9A-Za-z_-]+$/, {
        message: 'Username must contain only letters, numbers, underscores, or hyphens.',
      })
      .max(30, { message: 'The field must not contain more than 30 characters' }),
    email: z
      .string()
      .min(1, { message: 'This field has to be filled.' })
      .email('This is not a valid email.'),
    password: z
      .string()
      .min(6, { message: 'Password must be at least 6 characters' })
      .regex(
        /^(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])(?=.*[!"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~])[0-9A-Za-z!"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~]+$/,
        {
          message:
            'Password must include at least one uppercase letter, one lowercase letter, one number, and one special character.',
        }
      )
      .max(30, { message: 'The field must not contain more than 30 characters' }),
    confirmPassword: z.string(),
    isAgree: z.boolean().refine(val => val === true, { message: 'The checkbox must be checked' }),
  })
  .refine(
    values => {
      return values.password === values.confirmPassword
    },
    {
      message: 'Passwords must match!',
      path: ['confirmPassword'],
    }
  )

export type SignUpForm = z.infer<typeof loginSchema>

export const FormSignUp = ({ onSubmit }: Props) => {
  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    trigger,
  } = useForm<SignUpForm>({
    resolver: zodResolver(loginSchema),
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
      <div className={s.iconsBlock}>
        <Google />
        <Github />
      </div>
      <form className={s.form} id={formId} onSubmit={handleSubmit(onSubmit)}>
        <div className={s.containerInput}>
          <ControlledInput
            control={control}
            label={'Username'}
            name={'username'}
            trigger={trigger}
          />
          <ControlledInput control={control} label={'Email'} name={'email'} trigger={trigger} />
          <ControlledInput
            control={control}
            label={'Password'}
            name={'password'}
            trigger={trigger}
          />
          <ControlledInput
            control={control}
            label={'Password confirmation'}
            name={'confirmPassword'}
            trigger={trigger}
          />
        </div>
        <div className={s.containerCheckbox}>
          <ControlledCheckbox control={control} label={''} name={'isAgree'} trigger={trigger} />
          <Typography as={'span'} variant={'small_text'}>
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
        <Typography as={Link} href={'/ui/auth/signIn'} variant={'regular_link'}>
          Sign In
        </Typography>
      </Typography>
    </Cards>
  )
}

FormSignUp.displayName = 'FormSignUp'
