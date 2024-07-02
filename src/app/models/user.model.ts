
export interface UserType {
    email: string;
    username: string;
    _id: string;
    roleId: PermissionType;
}

export interface TokenType {
    access_token: string;
    refresh_token: string;
}

export interface PermissionType {
    user: boolean;
    admin: boolean;
    guest: boolean;
    moderator: boolean
}