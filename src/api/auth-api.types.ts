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
