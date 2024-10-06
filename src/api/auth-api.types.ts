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

export type LoginResponse = {
  accessToken: string
}

export type ConfirmationResponse = {
  statusCode: number
  message: string
  error?: string
  errors?: {
    property: string
    constraints: {
      [key: string]: string
    }
  }[]
}

export type RegistrationResponse = ConfirmationResponse & {
  details?: {
    email: string
    username: string
  }
}
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
