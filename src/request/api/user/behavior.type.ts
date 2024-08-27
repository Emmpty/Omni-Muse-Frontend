// 1.模型 2.图片 3.数据集 4.赏金 5.赏金作品 6.赛事
export type CommentType = 1 | 2 | 3 | 4 | 5 | 6;
// 1.评论 2.图片
export type ExpressionType = 1 | 2;
export type ExpressionEnum = 'like' | 'dislike' | 'heart' | 'laugh' | 'cry';
export interface GetCommentListReq {
  contentId: number | string;
  type: number;
  page: number;
  limit: number;
}

export type TReactions = {
  like: {
    count: number;
    status: boolean;
  };
  dislike: {
    count: number;
    status: boolean;
  };
  heart: {
    count: number;
    status: boolean;
  };
  laugh: {
    count: number;
    status: boolean;
  };
  cry: {
    count: number;
    status: boolean;
  };
};

export interface IComment {
  id: number;
  createdAt: string;
  nsfw: boolean;
  content: string;
  contentId: number;
  parentId: number;
  locked: boolean;
  tosViolation: boolean;
  hidden: boolean;
  user: {
    id: number;
    username: string;
    deletedAt: string;
    image: string;
    profilePicture: string;
    cosmetics: string;
  };
  reactions: TReactions;
  contentName: string;
  _count: {
    comments: number;
  };
}

export interface GetCommentListRes {
  comments: IComment[];
  currentPage: number;
  totalItems: number;
  totalPages: number;
}

export interface AddCommentReq {
  content: string;
  contentId: string;
  parentId?: number | string;
  type: CommentType;
}

export interface AddExpressionReq {
  contentId: string;
  type: ExpressionType;
  expression: ExpressionEnum;
  operation: boolean;
}
