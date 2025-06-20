export type GetUserPostsArgs = {
  userId: string
  pageNumber?: number
  pageSize?: number
}

export type GetUserPostsResponse = {
  pageSize: number
  totalCount: number
  pagesCount: number
  pageNumber: number
  items: ItemsType[]
}

export type ItemsType = {
  id: string
  description: string
  createdAt: string
  updatedAt: string
  images: string[]
  postOwnerInfo: PostOwnerInfoType
  like: Like
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

export type GetPublicPostsArgs = {
  endCursorPostId: string
  pageSize?: number
  pageNumber?: number
  sortBy?: string
  sortDirection?: string
}

export type GetPublicPostByIdArgs = {
  postId: string
  pageSize?: number
  pageNumber?: number
  sortBy?: string
  sortDirection?: string
}

export type GetPublicPostsResponse = GetUserPostsResponse
export type GetPublicPostByIdResponse = ItemsType

// FOLLOWING POSTS -------------------------------------------------
export type PostOwnerInfo = {
  userId: string
  username: string
  avatarUrl: string
}

export type LastLikeUser = {
  userId: string
  avatarUrl: string
}

export type Like = {
  likeCount: number
  myStatus: string
  lastLikeUser: LastLikeUser[]
}

export type Items = {
  id: string
  description: string
  createdAt: string
  updatedAt: string
  images: string[]
  postOwnerInfo: PostOwnerInfo
  like: Like
}

export type ResPostsFollowing = {
  pageNumber: number
  pagesCount: number
  pageSize: number
  totalCount: number
  items: Items[]
}

export type PostsFollowingParams = {
  endCursorPostId?: string
  pageSize?: number
  sortBy?: string
  pageNumber?: number
  sortDirection?: string
}

//----POST LIKED----

export type ToggleLikePostArgs = {
  postId: string
  status: 'like' | 'dislike' | 'none'
}
