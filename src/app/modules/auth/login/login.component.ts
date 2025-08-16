import { Component } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  showPassword: boolean = false;
  form: FormGroup;

  constructor(private authService: AuthService, private router: Router, private fb: FormBuilder, private toastr: ToastrService) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      rememberMe: [false]
    });
  }


  onSubmit() {
    if (this.form.invalid) return;

    const { email, password } = this.form.value;

    this.authService.login(email as string, password as string).subscribe({
      next: (res) => {
        this.toastr.success(res?.message || 'Login successful');
        this.router.navigate(['/user/profile']);
        localStorage.setItem("loggedIn-email", email);
      },
      error: (err) => {
        this.toastr.error(err.error?.message || 'Please enter valid credentials');
      }
    });
  }
}
