import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

@Injectable({ providedIn: 'root' })
export class UserService {
    constructor(private api: ApiService) { }

    registerUser(email: string): Observable<any> {
        return this.api.post<any>('user/registeruser', { email });
    }

    verifyOtp(payload: { email: string; otp: string }): Observable<any> {
        return this.api.post<any>('user/verifyotp', payload);
    }

    resendOtp(email: string): Observable<any> {
        return this.api.post<any>('user/resendotp', { email });
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
