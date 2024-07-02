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

export interface CommentType {
    blogId: string;
    userId: string;
    parentCommentId: string;
    left: number;
    right: number;
    content: string;
    isDeleted: boolean;
    createdAt: Date;
}