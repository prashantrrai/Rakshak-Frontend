import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: 'registration', loadComponent: () => import('./registration/registration.component').then(m => m.RegistrationComponent) },
  { path: 'otp', loadComponent: () => import('./otp/otp.component').then(m => m.OtpComponent) },
  { path: 'login', loadComponent: () => import('./login/login.component').then(m => m.LoginComponent) },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
