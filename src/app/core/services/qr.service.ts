import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

@Injectable({ providedIn: 'root' })
export class QrService {
    constructor(private api: ApiService) { }

    // endpoint: /api/QR/GenerateQRCode?virtualNumber=VID-...
    generateQRCode(virtualNumber: string): Observable<Blob> {
        return this.api.getBlob(`QR/GenerateQRCode?virtualNumber=${virtualNumber}`);
    }
}