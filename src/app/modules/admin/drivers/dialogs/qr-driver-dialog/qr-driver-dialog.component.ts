import { Component, Inject, OnInit } from '@angular/core';
import { MaterialModule } from '../../../../../shared/material/material.module';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { QrService } from '../../../../../core/services/qr.service';

@Component({
  selector: 'app-qr-driver-dialog',
  imports: [MaterialModule],
  templateUrl: './qr-driver-dialog.component.html',
  styleUrl: './qr-driver-dialog.component.scss'
})
export class QrDriverDialogComponent implements OnInit {
  qrUrl: string | null = null;
  loading = true;
  error = false;

  constructor(
    public dialogRef: MatDialogRef<QrDriverDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private qrService: QrService
  ) { }

  ngOnInit(): void {
    this.qrService.generateQRCode(this.data.virtualNumber).subscribe({
      next: (blob) => {
        this.qrUrl = URL.createObjectURL(blob);
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
        this.error = true;
      }
    });
  }

  close(): void {
    this.dialogRef.close();
  }
}
