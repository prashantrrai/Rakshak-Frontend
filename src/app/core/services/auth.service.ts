import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { ApiService } from './api.service';

const TOKEN_KEY = 'rakshak_token';
const USER_EMAIL = 'rakshak_user_email';

@Injectable({ providedIn: 'root' })
export class AuthService {
    private _token$ = new BehaviorSubject<string | null>(this.getTokenFromStorage());
    public token$ = this._token$.asObservable();

    constructor(private api: ApiService) { }

    private getTokenFromStorage(): string | null {
        return localStorage.getItem(TOKEN_KEY);
    }

    private setToken(token: string | null) {
        if (token) localStorage.setItem(TOKEN_KEY, token);
        else localStorage.removeItem(TOKEN_KEY);
        this._token$.next(token);
    }

    isLoggedIn(): boolean {
        const t = this.getTokenFromStorage();
        // token expiry check could be added here by decoding JWT
        return !!t;
    }

    getToken(): string | null {
        return this.getTokenFromStorage();
    }

    logout() {
        this.setToken(null);
        localStorage.removeItem(USER_EMAIL);
    }

    // Example login - adapt to your backend (if login endpoint exists)
    login(email: string, password: string): Observable<any> {
        return this.api.post<any>('auth/login', { email, password }).pipe(
            map(resp => {
                if (resp && resp.token) {
                    this.setToken(resp.token);
                    localStorage.setItem(USER_EMAIL, email);
                }
                return resp;
            })
        );
    }

    // Register user (calls your api/user/registeruser)
    // registerUser(payload: any): Observable<any> {
    //     return this.api.post<any>('user/registeruser', payload);
    // }

    // verifyOtp(payload: { email: string; otp: string }): Observable<any> {
    //     return this.api.post<any>('user/verifyotp', payload);
    // }

    // resendOtp(payload: { email: string }): Observable<any> {
    //     return this.api.post<any>('user/resendotp', payload);
    // }
}