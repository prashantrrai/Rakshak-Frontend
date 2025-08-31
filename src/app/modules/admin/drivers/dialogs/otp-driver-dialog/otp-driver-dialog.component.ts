import { Component, Inject } from '@angular/core';
import { MaterialModule } from '../../../../../shared/material/material.module';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { interval, Subscription } from 'rxjs';
import { UserService } from '../../../../../core/services/user.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-otp-driver-dialog',
  imports: [MaterialModule],
  templateUrl: './otp-driver-dialog.component.html',
  styleUrl: './otp-driver-dialog.component.scss'
})
export class OtpDriverDialogComponent {
  otp: string = '';
  timer: number = 60;
  timerSub!: Subscription;
  email: string = '';

  constructor(
    public dialogRef: MatDialogRef<OtpDriverDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private userService: UserService,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    this.email = this.data.email;
    this.timer = 0;
  }

  startTimer() {
    this.timer = 60;
    if (this.timerSub) this.timerSub.unsubscribe();

    this.timerSub = interval(1000).subscribe(() => {
      this.timer--;
      if (this.timer <= 0 && this.timerSub) this.timerSub.unsubscribe();
    });
  }

  resendOtp() {
    this.startTimer();
    this.userService.resendOtp(this.email).subscribe({
      next: (res: any) => {
        this.toastr.success(res?.message || "OTP Sent on your Email.");
        this.startTimer();
      },
      error: (err) => {
        this.toastr.error(err?.error?.message || 'Re-Send OTP failed');
      }
    });
  }

  verify(): void {
    if (this.otp.length === 6) {
      const payload = {
        email: this.email,
        otp: this.otp
      }
      this.dialogRef.close(payload);
    }
    else {
      this.toastr.error('Must be Minimum 6 Digit.');
      return;
    }
  }

  cancel(): void {
    this.dialogRef.close(null);
  }
}
