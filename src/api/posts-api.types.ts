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
