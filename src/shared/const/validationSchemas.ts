import { PASSWORD_PATTERN, USERNAME_PATTERN } from './regex'
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

export const signInSchema = z.object({
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
    }),
})

export const changeProfileSchema = z.object({
  userName: z
    .string()
    .min(6, { message: 'Minimum 6 characters' })
    .max(30, { message: 'Maximum 30 characters' })
    .refine(value => /^[0-9A-Za-z_\-]+$/.test(value), {
      message: 'Allowed characters: 0-9, A-Z, a-z, _, -',
    }),
  firstName: z
    .string()
    .min(1, { message: 'Minimum 1 character' })
    .max(50, { message: 'Maximum 50 characters' })
    .refine(value => /^[A-Za-zА-Яа-я]+$/.test(value), {
      message: 'Allowed characters: A-Z, a-z, А-Я, а-я',
    }),
  lastName: z
    .string()
    .min(1, { message: 'Minimum 1 character' })
    .max(50, { message: 'Maximum 50 characters' })
    .refine(value => /^[A-Za-zА-Яа-я]+$/.test(value), {
      message: 'Allowed characters: A-Z, a-z, А-Я, а-я',
    }),
  dateOfBirth: z.preprocess(
    arg => {
      if (typeof arg === 'string' || arg instanceof String) {
        return new Date(arg as string)
      }
      return arg
    },
    z.date().refine(
      date => {
        return new Date().getTime() - date.getTime() > 13 * 365 * 24 * 60 * 60 * 1000
      },
      {
        message: 'A user under 13 cannot create a profile. ',
      }
    )
  ),
  country: z.string().min(1, { message: 'Country is required' }),
  city: z.string().min(1, { message: 'City is required' }),
  about: z
    .string()
    .min(1, { message: 'Field is required' })
    .max(200, { message: 'Maximum 200 characters' })
    .refine(value => /^[0-9A-Za-zА-Яа-я\s\-_.'":,!]*$/.test(value), {
      message: 'Allowed characters: 0-9, A-Z, a-z, А-Я, а-я, and special characters',
    }),
})
