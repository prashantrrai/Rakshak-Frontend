import { Component, inject, OnInit, ViewChildren, QueryList, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastService } from '../../../core/services/toast.service';
import { UserService } from '../../../core/services/user.service';

@Component({
  selector: 'app-otp',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './otp.component.html',
  styleUrls: ['./otp.component.scss']
})
export class OtpComponent implements OnInit {
  email = '';
  otpDigits = ['', '', '', '', '', ''];
  @ViewChildren('otpInput') otpInputs!: QueryList<ElementRef>;

  private user = inject(UserService);
  private route = inject(ActivatedRoute);
  private toast = inject(ToastService);
  private router = inject(Router);

  ngOnInit() {
    this.email = this.route.snapshot.queryParamMap.get('email') || '';
  }

  onInputChange(event: any, index: number) {
    const value = event.target.value;
    if (/^[0-9]$/.test(value)) {
      this.otpDigits[index] = value;
      if (index < 5) this.otpInputs.toArray()[index + 1].nativeElement.focus();
    } else {
      event.target.value = '';
    }
  }

  onKeyDown(event: KeyboardEvent, index: number) {
    if (event.key === 'Backspace' && !this.otpDigits[index] && index > 0) {
      this.otpInputs.toArray()[index - 1].nativeElement.focus();
    }
  }

  pasteOtp(event: ClipboardEvent) {
    const pasted = event.clipboardData?.getData('text') || '';
    if (/^\d{6}$/.test(pasted)) {
      this.otpDigits = pasted.split('');
      this.otpInputs.last.nativeElement.focus();
    }
    event.preventDefault();
  }

  submitOtp() {
    const otp = this.otpDigits.join('');
    if (otp.length !== 6) {
      this.toast.error('Please enter a valid OTP');
      return;
    }
    this.user.verifyOtp({ email: this.email, otp }).subscribe({
      next: () => {
        this.toast.success('OTP Verified! Redirecting...');
        this.router.navigate(['/user']); // TODO: create user dashboard later
      },
      error: () => this.toast.error('Invalid OTP')
    });
  }
}