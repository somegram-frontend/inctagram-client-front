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
}

export type ItemsType = {
  id: string
  description: string
  createdAt: string
  updatedAt: string
  images: string[]
  postOwnerInfo: PostOwnerInfoType
}

type PostOwnerInfoType = {
  userId: string
  username: string
  avatarUrl: string
}

export type UpdateUserPostArgs = {
  postId: string
  description: string
}

export type UpdateUserPostResponse = {
  statusCode: number
  message: string
  error?: string
  errors?: {
    property: string
    constraints: {
      description: string
    }
  }[]
}

export type ApiResponse = {
  statusCode: number
  message: string
  errors: ValidationError[]
}

type ValidationError = {
  property: string
  constraints: {
    [key: string]: string
  }
}

export type AddUserPostsArgs = {
  files: File[]
  description: string
}
