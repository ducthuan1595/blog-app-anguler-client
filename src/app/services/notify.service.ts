import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

import { URL_SERVER } from "../util/contant";
import { NotifyType } from "../models/notify.model";

@Injectable({providedIn: 'root'})

export class NotifyService {

    constructor(private http: HttpClient) {}

    getUnNotify () {
        return this.http.get<{message: string; data: NotifyType[] | []}>(`${URL_SERVER}/v1/api/notify/unread`)
    }

    getReadNotify () {
        return this.http.get<{message: string; data: NotifyType[] | []}>(`${URL_SERVER}/v1/api/notify/read`)
    }

    changeReadNotify (notifyId: string) {
        return this.http.put<{message: string; data: NotifyType[] | []}>(`${URL_SERVER}/v1/api/notify`, {
            notifyId
        })
    }
}