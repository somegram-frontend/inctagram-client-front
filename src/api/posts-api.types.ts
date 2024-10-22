export type GetUserPostsArgs = {
  userId: string
  pageNumber?: number
  pageSize?: number
}

export type GetUserPostsResponse = {
  page: number
  pageSize: number
  totalCount: number
  pagesCount: number
  items: ItemsType[]
  postOwnerInfo: PostOwnerInfoType
}

type PostOwnerInfoType = {
  userId: string
  username: string
  avatarUrl: string
}

type ItemsType = {
  id: string
  description: string
  createdAt: string
  updatedAt: string
  images: string[]
}

export type UpdateUserPostArgs = {
  id: string
  description: string
}

export type UpdateUserPostResponse = {
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
