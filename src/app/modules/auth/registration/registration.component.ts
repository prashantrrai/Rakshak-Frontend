import { Component } from '@angular/core';
import { UserService } from '../../../core/services/user.service';
import { Router, RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-registration',
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.scss'
})
export class RegistrationComponent {
  form: FormGroup;

  constructor(private userService: UserService, private router: Router, private fb: FormBuilder, private toastr: ToastrService) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      acceptTNC: [false, Validators.requiredTrue]
    });
  }


  onSubmit() {
    if (this.form.invalid) return;
    const email = this.form.value.email!;

    this.userService.registerUser(email).subscribe({
      next: () => {
        this.toastr.success('OTP sent to your email');
        this.router.navigate(['/auth/otp'], { queryParams: { email } });
      },
      error: (err) => {
        this.toastr.error(err?.error?.message || 'Registration failed');
      }
    });
  }
}
