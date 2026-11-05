
export type HomeView = "latest" | "popular" | "saved";
export type Privacy = "public" | "followers" | "private";

export interface User {
  _id: string;
  name: string;
  username?: string;
  photo?: string | null;
}

export interface TopComment {
  _id: string;
  content?: string;
  text?: string;
  commentCreator?: User | null;
  commentCreater?: User | null;
  createdAt?: string;
}

export interface SharedPost {
  _id: string;
  body?: string;
  image?: string | null;
  privacy?: string;
  user?: User | null;
  createdAt?: string;
}

export interface PostType {
  _id: string;
  id?: string;
  body?: string;
  image?: string | null;
  privacy?: string;
  user?: User | null;
  sharedPost?: SharedPost | null;
  likes?: unknown[];
  createdAt: string;
  commentsCount?: number;
  topComment?: TopComment | null;
  sharesCount?: number;
  likesCount?: number;
  isShare?: boolean;
  bookmarked?: boolean;
}

export interface CommentType {
  _id: string;
  content?: string;
  text?: string;
  createdAt?: string;
  commentCreator?: User | null;
  commentCreater?: User | null;
  user?: User | null;
}

export interface CommentCardProps {
  comment: CommentType;
  postId: string;
  showDate?: boolean;
}
export interface PostCardProps {
  post: PostType;
  saved: boolean;
  onToggleSave: (id: string) => void;
  allComments?: CommentType[];
}