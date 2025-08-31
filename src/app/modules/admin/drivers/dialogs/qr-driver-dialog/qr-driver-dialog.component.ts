import { Component, Inject } from '@angular/core';
import { MaterialModule } from '../../../../../shared/material/material.module';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-qr-driver-dialog',
  imports: [MaterialModule],
  templateUrl: './qr-driver-dialog.component.html',
  styleUrl: './qr-driver-dialog.component.scss'
})
export class QrDriverDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) { }
}
