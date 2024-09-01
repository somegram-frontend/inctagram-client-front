export type registrationConformationArgs = {
  token: string
}

export type registrationArgs = {
  username: string
  email: string
  password: string
  html: string
}

export type restorePasswordArgs = {
  email: string
  recaptchaToken: string
  html: string
}

export type restorePasswordConfirmationArgs = {
  code: string
  password: string
}

export type loginArgs = {
  email: string
  password: string
}

export type registrationErrorResponse400 = {
  error: string
  message: string
  details: {
    email: string
    username: string
  }
}

export type registrationErrorResponse422 = {
  statusCode: number
  message: string
  errors: [
    {
      property: string
      constraints: {
        IsUsername: string
      }
    },
    {
      property: string
      constraints: {
        isEmail: string
      }
    },
    {
      property: symbol
      constraints: {
        length: string
      }
    },
  ]
}

export type loginResponse = {
  accessToken: string
}

export enum EnumTokens {
  'ACCESS_TOKEN' = 'accessToken',
  'REFRESH_TOKEN' = 'refreshToken',
}
