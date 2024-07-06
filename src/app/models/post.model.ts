import { CommentType } from "./comment.model";
import { UserType } from "./user.model";
export interface ResponsePostType {
  _id: string;
  title: string;
  image: {
    public_id: string;
    url: string;
  };
  desc: string;
  categoryId: {
    name: string;
    _id: string;
    image: {
      url: string;
    }
  };
  userId: {
    username: string;
    _id: string;
    avatar: any;
  };
  createdAt: Date;
  comments?: number;
  totalLiked?: number;
}

export interface ResponsePostPageType {
  posts: ResponsePostType[];
  meta: {
    totalPage: number;
    nextPage: boolean;
    prevPage: boolean;
    totalPosts: number;
    currPage: number;
  }
}

export interface ResponseFavoritePostPageType {
  value: ResponsePostType[];
  score: number;
}

export interface RequestPostType {
  title: string;
  image: {
    public_id: string;
    url: string;
  };
  desc: string;
  categoryId: string;
}

export interface PostSearchType {
  value: {
    data: {
      _id: string;
      title: string;
      image: {
        public_id: string;
        url: string;
      };
      desc: string;
      categoryId: string;
      userId: UserType;
    }
  }
}
