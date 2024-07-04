
export interface UserType {
    email: string;
    username: string;
    _id: string;
    roleId: PermissionType;
}

export interface PermissionType {
    user: boolean;
    admin: boolean;
    guest: boolean;
    moderator: boolean
}

export interface TokensType {
    access_token: string;
    refresh_token: string;
}