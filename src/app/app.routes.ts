import { Routes } from '@angular/router';

export const routes: Routes = [
    { path: 'register', loadComponent: () => import('./features/auth/register/register.component').then(m => m.RegisterComponent) },
    { path: 'otp', loadComponent: () => import('./features/auth/otp/otp.component').then(m => m.OtpComponent) },
    { path: 'login', loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent) },
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: '**', loadComponent: () => import('./shared/components/not-found/not-found.component').then(m => m.NotFoundComponent) }
];
