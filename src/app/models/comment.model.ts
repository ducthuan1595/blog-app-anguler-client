import { UserType } from "./user.model";

export interface CreateCommentType {
    blogId: string;
    userId: String;
    content: string;
    parentCommentId?: string;
}

export interface GetCommentType {
    blogId: string;
    limit?: number;
    offset?: number;
    parentCommentId?: string;
}

export interface DeleteCommentType {
    blogId: string;
    commentId: string
}

export interface CommentAllType extends CommentType {
    replies?: CommentType[];
}

export interface CommentType {
    blogId: string;
    parentCommentId: string;
    left: number;
    right: number;
    content: string;
    isDeleted: boolean;
    createdAt: Date;
    userId: UserType;
    _id: string;
}