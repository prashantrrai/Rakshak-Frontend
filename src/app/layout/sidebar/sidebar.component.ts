import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

interface NavItem {
  label: string;
  route: string;
  icon?: string;
  roles?: string[];
}

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
  @Input() isOpen = true; // default open
  @Output() isOpenChange = new EventEmitter<boolean>();

  navItems: NavItem[] = [
    { label: 'Dashboard', route: '/admin/dashboard', icon: 'fas fa-home', roles: ['Admin'] },
    { label: 'Profile', route: '/user/profile', icon: 'fas fa-user' },
    { label: 'Drivers', route: '/admin/drivers', icon: 'fas fa-users', roles: ['Admin'] },
    { label: 'Settings', route: '/admin/settings', icon: 'fas fa-cog', roles: ['Admin'] }
  ];

  currentUserRole = localStorage.getItem('role') || 'Admin';

  constructor(private router: Router) { }

  canView(item: NavItem): boolean {
    return !item.roles || item.roles.includes(this.currentUserRole);
  }

  navigate(route: string) {
    this.router.navigate([route]);
  }

  toggleSidebar() {
    this.isOpen = !this.isOpen;
    this.isOpenChange.emit(this.isOpen);
  }
}
