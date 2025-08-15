import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

@Injectable({ providedIn: 'root' })
export class UserService {
    constructor(private api: ApiService) { }

    registerUser(payload: any): Observable<any> {
        return this.api.post<any>('user/registeruser', payload);
    }

    verifyOtp(payload: { email: string; otp: string }): Observable<any> {
        return this.api.post<any>('user/verifyotp', payload);
    }

    resendOtp(payload: { email: string }): Observable<any> {
        return this.api.post<any>('user/resendotp', payload);
    }

    updateProfile(payload: any): Observable<any> {
        return this.api.post<any>('user/updateprofile', payload);
        // or put depending on your backend
    }

    getUserByEmail(email: string): Observable<any> {
        return this.api.get<any>('user/getuserbyemail', { email });
    }

    getUserByVirtualNumber(virtualNumber: string): Observable<any> {
        return this.api.get<any>('user/getuserbyvirtualnumber?virtualNumber=${virtualNumber}');
    }

    generateVirtualNumber(email: string): Observable<any> {
        return this.api.post<any>('user/generatevirtualnumber', { email });
    }

    deleteUser(emailOrId: string): Observable<any> {
        return this.api.post<any>('user/deleteuser', { identifier: emailOrId });
    }
}
