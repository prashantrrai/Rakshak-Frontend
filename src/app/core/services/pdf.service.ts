import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { saveAs } from 'file-saver';

@Injectable({ providedIn: 'root' })
export class PdfService {
    constructor(private api: ApiService) { }

    // your endpoint: /api/PDF/GenerateSticker/{email}
    getStickerPdfByEmail(email: string): Observable<Blob> {
        // Using getBlob above to request blob
        return this.api.getBlob(`PDF/GenerateSticker/${encodeURIComponent(email)}`);
    }

    // utility to download
    downloadSticker(email: string, filename?: string) {
        this.getStickerPdfByEmail(email).subscribe(blob => {
            const name = filename ?? `VID-sticker-${email}.pdf`;
            saveAs(blob, name);
        }, err => {
            console.error('PDF download error', err);
            throw err;
        });
    }
}