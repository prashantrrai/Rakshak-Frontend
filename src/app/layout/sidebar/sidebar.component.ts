import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

interface NavItem {
  label: string;
  route: string;
  icon?: string;
  roles?: string[]; // optional role-based visibility
}

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
  @Input() userRole: string = '';

  navItems: NavItem[] = [
    { label: 'Dashboard', route: '/admin/dashboard', icon: 'fas fa-home', roles: ['Admin'] }, // Stats
    { label: 'Profile', route: '/user/profile', icon: 'fas fa-user' }, // Personal Page
    { label: 'Users', route: '/admin/users', icon: 'fas fa-users', roles: ['Admin'] }, // All User Grid
    { label: 'Settings', route: '/admin/settings', icon: 'fas fa-cog', roles: ['Admin'] } // Config Setting
  ];

  // Example: get current user role from localStorage
  currentUserRole = localStorage.getItem('role') || 'Admin';

  constructor(private router: Router) { }

  canView(item: NavItem): boolean {
    return !item.roles || item.roles.includes(this.currentUserRole);
  }

  navigate(route: string) {
    this.router.navigate([route]);
  }
}
