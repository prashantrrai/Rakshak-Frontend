import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

@Injectable({ providedIn: 'root' })
export class AdminService {
    constructor(private api: ApiService) { }

    // get paged user list: backend: /Admin/GetUserList
    // Accepts query params for page, pageSize, search, sort, filters as needed
    getUserList(params?: { page?: number; pageSize?: number; search?: string; sort?: string }): Observable<any> {
        const query: any = {};
        if (params?.page !== undefined) query.page = params.page;
        if (params?.pageSize !== undefined) query.pageSize = params.pageSize;
        if (params?.search) query.search = params.search;
        if (params?.sort) query.sort = params.sort;
        return this.api.get<any>('Admin/GetUserList', query);
    }

    deleteUser(userIdOrEmail: string): Observable<any> {
        // If your backend expects email or id in path or body adjust accordingly
        return this.api.post<any>(`user/deleteuser`, { identifier: userIdOrEmail });
    }

    getUserByEmail(email: string): Observable<any> {
        return this.api.get<any>(`user/getuserbyemail`, { email });
    }

    getUserByVirtualNumber(virtualNumber: string): Observable<any> {
        return this.api.get<any>(`user/getuserbyvirtualnumber?virtualNumber=${virtualNumber}`);
    }

    generateVirtualNumber(email: string): Observable<any> {
        return this.api.post<any>(`user/generatevirtualnumber`, { email });
    }
}