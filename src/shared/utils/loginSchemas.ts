import { PASSWORD_PATTERN, USERNAME_PATTERN } from '@/shared/const/regex'
import { z } from 'zod'

export const signUpSchema = z
  .object({
    username: z
      .string()
      .regex(USERNAME_PATTERN, {
        message: 'Username must contain only latin letters, numbers, underscores, or hyphens.',
      })
      .min(1, { message: 'This field has to be filled.' })
      .min(6, { message: 'Username must be at least 6 characters' })
      .max(30, { message: 'The field must not contain more than 30 characters' }),
    email: z
      .string()
      .min(1, { message: 'This field has to be filled.' })
      .email('This is not a valid email.'),
    password: z
      .string()
      .min(6, { message: 'Password must be at least 6 characters' })
      .regex(PASSWORD_PATTERN, {
        message:
          'Password must include at least one uppercase latin letter, one lowercase latin letter, one number, and one special character.',
      })
      .max(20, { message: 'The field must not contain more than 20 characters' }),
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

export const signInSchema = z
  .object({
    email: z
      .string()
      .min(1, { message: 'This field has to be filled.' })
      .email('This is not a valid email.'),
    password: z
      .string()
      .min(6, { message: 'Password must be at least 6 characters' })
      .regex(PASSWORD_PATTERN, {
        message:
          'Password must include at least one uppercase latin letter, one lowercase latin letter, one number, and one special character.',
      })
  })