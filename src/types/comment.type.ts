export type CommentType = {
  id: string;
  text: string;
  date: string;
  likesCount: number;
  dislikesCount: number;
  user: {
    id: string;
    name: string;
  };
};

export type AllCommentType = {
  allCount: number;
  comments: CommentType[];
};

export type AddCommentType = {
  text: string;
  article: string;
};
