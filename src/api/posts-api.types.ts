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

export type AddUserPostsArgs = {
  description: string
  files: string[][]
}


export type AddUserPostsResponse = ApiResponse & {
  id: string
  description: string
  createdAt: string
  updatedAt: string
  images: string[]
  postOwnerInfo: PostOwnerInfoType
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
