export type RegistrationArgs = {
  username: string
  email: string
  password: string
  html: string
}
export type RegistrationConformationArgs = {
  token: string
}
export type RegistrationReconfirmationArgs = {
  token: string
  html: string
}
export type restorePasswordArgs = {
  email: string
  recaptchaToken: string
  html: string
}

export type RestorePasswordConfirmationArgs = {
  code: string
  password: string
}

export type LoginArgs = {
  email: string
  password: string
}

export type RegistrationResponseSuccess = {
  statusCode: number
  message: string
}

export type RegistrationErrorResponse400 = {
  error: string
  details: {
    email: string
    username: string
  }
}

export type RegistrationErrorResponse422 = {
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

export type LoginResponse = {
  accessToken: string
}

export enum EnumTokens {
  'ACCESS_TOKEN' = 'accessToken',
  'REFRESH_TOKEN' = 'refreshToken',
}

export type ConfirmationErrorResponse400 = {
  error: string
  message: string
}

export type ConfirmationErrorResponse422 = {
  statusCode: number
  message: string
  errors: [
    {
      property: string
      constraints: {
        IsString: string
      }
    },
  ]
}

export type RegistrationResponse = RegistrationResponseSuccess &
  RegistrationErrorResponse400 &
  RegistrationErrorResponse422

export type ConfirmationResponse = RegistrationResponseSuccess &
  ConfirmationErrorResponse400 &
  ConfirmationErrorResponse422

export type MeResponseSuccess = {
  email: string
  userName: string
  userId: string
}

export type MeErrorResponse401 = {
  statusCode: number
  message: string
}

export type MeResponse = MeResponseSuccess & MeErrorResponse401
