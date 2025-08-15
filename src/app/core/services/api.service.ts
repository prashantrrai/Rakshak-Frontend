import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ApiService {
    private http = inject(HttpClient);
    private baseUrl = environment.apiBaseUrl;

    get<T>(url: string, p0?: { email: string; }) {
        return this.http.get<T>(`${this.baseUrl}/${url}`);
    }
    post<T>(url: string, body: any) {
        return this.http.post<T>(`${this.baseUrl}/${url}`, body);
    }
    put<T>(url: string, body: any) {
        return this.http.put<T>(`${this.baseUrl}/${url}`, body);
    }
    delete<T>(url: string) {
        return this.http.delete<T>(`${this.baseUrl}/${url}`);
    }
    getBlob(url: string): Observable<Blob> {
        return this.http.get(url, { responseType: 'blob' });
    }
}