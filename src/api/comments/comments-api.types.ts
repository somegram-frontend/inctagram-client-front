export type CreateCommentRequest = {
  postId: string
  comment: string
}

export type CreateAnswerCommentRequest = {
  commentId: string
  comment: string
}

export interface GetCommentResponse {
  pageNumber: number
  pagesCount: number
  pageSize: number
  totalCount: number
  items: Comment[]
}

export interface Comment {
  id: string
  body: string
  createdAt: string
  answersCount: number
  user: User
  like: Like
}

export interface User {
  id: string
  username: string
  avatarUrl: string
}

export interface Like {
  likesCount: number
  dislikeCount: number
  myStatus: string
}

export interface AnswerCommentResponse {
  pageNumber: number
  pagesCount: number
  pageSize: number
  totalCount: number
  items: Answer[]
}

export interface Answer {
  id: string
  body: string
  createdAt: string
  answersCount: number
  user: User
  like: Like
  answerForCommentId: string
}
