import { Component, Inject } from '@angular/core';
import { MaterialModule } from '../../../../../shared/material/material.module';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-otp-driver-dialog',
  imports: [MaterialModule],
  templateUrl: './otp-driver-dialog.component.html',
  styleUrl: './otp-driver-dialog.component.scss'
})
export class OtpDriverDialogComponent {
  otp: string = '';

  constructor(
    public dialogRef: MatDialogRef<OtpDriverDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  verify(): void {
    if (this.otp.length === 6) {
      this.dialogRef.close(this.otp); // send OTP back
    }
  }

  cancel(): void {
    this.dialogRef.close(null);
  }
}
