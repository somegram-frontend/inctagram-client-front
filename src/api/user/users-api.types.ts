export type GetProfileSuccess = UserProfile & {
  email: string
  avatar: {
    url: string
  }
}

export type GetProfileMetricsSuccess = UserProfile & {
  id: string
  userName: string
  isFollowing: boolean
  isFollowedBy: boolean
  followingCount: number
  followersCount: number
  publicationsCount: number
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

export type UserItem = {
  id: string
  userName: string
  avatar: {
    url: string
  }
  about: string
}

export type GetUsersResponse = {
  pageNumber: number
  pagesCount: number
  pageSize: number
  totalCount: number
  items: UserItem[]
}

export type GetUserProfileSuccess = {
  id: string
  userName: string
  avatar: {
    url: string
  }
  isFollowing: boolean
  isFollowedBy: boolean
  followingCount: number
  followersCount: number
  publicationsCount: number
}

export type GetProfileMetricsSuccess = {
  id: string
  userName: string
  avatar: {
    url: string
  }
  isFollowing: boolean
  isFollowedBy: boolean
  followingCount: number
  followersCount: number
  publicationsCount: number
}
