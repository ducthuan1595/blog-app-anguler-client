import { UserType } from "./user.model";

export interface NotifyType {
    notify_type: string;
    notify_senderId: string;
    notify_receiverId: string;
    notify_content: string;
    createdAt: Date;
    notify_option: object;
    sender: UserType,
}