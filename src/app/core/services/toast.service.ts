import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export type ToastMessage = { type: 'success' | 'error' | 'info' | 'warning', text: string };

@Injectable({ providedIn: 'root' })
export class ToastService {
    private _messages = new Subject<ToastMessage>();
    messages$ = this._messages.asObservable();

    success(text: string) { this._messages.next({ type: 'success', text }); }
    error(text: string) { this._messages.next({ type: 'error', text }); }
    info(text: string) { this._messages.next({ type: 'info', text }); }
    warning(text: string) { this._messages.next({ type: 'warning', text }); }
}