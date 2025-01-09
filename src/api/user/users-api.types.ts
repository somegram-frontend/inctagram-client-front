export type GetProfileSuccess = UserProfile & {
  email: string
  avatar: {
    url: string
  }
}
export type GetPublicProfileSuccess = {
  id: string
  userName: string
  about: string
  avatar: {
    url: string
  }
}
export type UserProfile = {
  userName: string
  firstName: string
  lastName: string
  dateOfBirth: string
  about: string
  city: string
  country: string
}

export type ProfileResponse = {
  statusCode: number
  message?: string
  errors?: {
    property: string
    constraints: {
      [key: string]: string
    }
  }[]
}

export type GetTotalCountResponse = {
  totalCount: number
}
