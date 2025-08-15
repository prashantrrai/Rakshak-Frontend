import { Component, ElementRef, OnInit, QueryList, ViewChildren, OnDestroy, AfterViewInit } from '@angular/core';
import { UserService } from '../../../core/services/user.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { interval, Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormArray, FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-otp',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './otp.component.html',
  styleUrls: ['./otp.component.scss']
})
export class OtpComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChildren('otpInput') otpInputs!: QueryList<ElementRef>;
  email = '';
  // otpDigits: string[] = Array(6).fill('');
  timer: number = 60;
  timerSub!: Subscription;
  otpControls = new FormArray(Array.from({ length: 6 }, () => new FormControl('')));


  constructor(
    private userService: UserService,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.email = this.route.snapshot.queryParamMap.get('email') || '';
    this.startTimer();
  }

  ngAfterViewInit() {
    // start focus at first input
    this.focusInput(0);
  }

  focusInput(index: number) {
    const input = this.otpInputs.toArray()[index];
    if (input) {
      input.nativeElement.focus();
      input.nativeElement.select();
    }
  }

  onInputChange(index: number) {
    const control = this.otpControls.at(index);
    if (!control) return; // safety check

    const value = (control.value || '').toString().replace(/\D/g, '');
    control.setValue(value, { emitEvent: false });

    if (value && index < this.otpControls.length - 1) {
      // use microtask to avoid Angular focus issues
      Promise.resolve().then(() => this.focusInput(index + 1));
    }
  }

  onKeyDown(event: KeyboardEvent, index: number) {
    if (event.key === 'Backspace') {
      event.preventDefault();
      if (this.otpControls.at(index).value) {
        this.otpControls.at(index).setValue('');
      } else if (index > 0) {
        this.focusInput(index - 1);
        this.otpControls.at(index - 1).setValue('');
      }
    } else if (event.key === 'ArrowLeft' && index > 0) {
      event.preventDefault();
      this.focusInput(index - 1);
    } else if (event.key === 'ArrowRight' && index < this.otpControls.length - 1) {
      event.preventDefault();
      this.focusInput(index + 1);
    } else if (!event.key.match(/^[0-9]$/)) {
      event.preventDefault();
    }
  }

  onPaste(event: ClipboardEvent) {
    event.preventDefault();
    const pasted = event.clipboardData?.getData('text') || '';
    const digits = pasted.replace(/\D/g, '').slice(0, 6).split('');

    digits.forEach((digit, i) => {
      this.otpControls.at(i).setValue(digit);
    });

    const nextIndex = digits.length < 6 ? digits.length : 5;
    this.focusInput(nextIndex);
  }

  isOtpComplete(): boolean {
    // Check if every control has a non-empty value
    return this.otpControls.controls.every(ctrl => (ctrl.value || '').toString().trim() !== '');
  }

  startTimer() {
    this.timer = 60; // 1 sec for dev
    if (this.timerSub) this.timerSub.unsubscribe();

    this.timerSub = interval(1000).subscribe(() => {
      this.timer--;
      if (this.timer <= 0 && this.timerSub) this.timerSub.unsubscribe();
    });
  }

  resendOtp() {
    this.userService.resendOtp(this.email).subscribe({
      next: (res: any) => {
        this.toastr.success(res?.message || "OTP Sent on your Email.");
        this.otpControls.controls.forEach(ctrl => ctrl.setValue(''));
        this.startTimer();

        // Focus first input after DOM updates
        Promise.resolve().then(() => this.focusInput(0));
      },
      error: (err) => {
        this.toastr.error(err?.error?.message || 'Re-Send OTP failed');
      }
    });
  }


  submitOtp() {
    const otp = this.otpControls.value.join('');

    if (otp.length !== 6) {
      this.toastr.error('Please enter a valid OTP');
      return;
    }

    this.userService.verifyOtp({ email: this.email, otp }).subscribe({
      next: (res: any) => {
        this.toastr.success(res.message || 'OTP Verified! Redirecting...')
        setTimeout(() => this.router.navigate(['/user/profile']), 1000);
      },
      error: (err: any) => this.toastr.error(err?.error?.message || 'Something went wrong')
    });
  }

  ngOnDestroy() {
    if (this.timerSub) this.timerSub.unsubscribe();
  }
}
