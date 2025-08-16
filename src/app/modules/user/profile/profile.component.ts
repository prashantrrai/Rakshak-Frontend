import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../core/services/user.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PdfService } from '../../../core/services/pdf.service';

@Component({
  selector: 'app-profile',
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {
  email: string = '';
  user: any = {};
  bloodGroups = [
    { id: 1, name: 'A+' },
    { id: 2, name: 'A-' },
    { id: 3, name: 'B+' },
    { id: 4, name: 'B-' },
    { id: 5, name: 'AB+' },
    { id: 6, name: 'AB-' },
    { id: 7, name: 'O+' },
    { id: 8, name: 'O-' },
  ];

  constructor(private userService: UserService, private pdfService: PdfService, private toastr: ToastrService, private route: ActivatedRoute) { }

  ngOnInit() {
    const emailFromStorage = localStorage.getItem("loggedIn-email") || '';
    this.email = this.route.snapshot.queryParamMap.get('email') || emailFromStorage;
    this.loadUser(this.email);
  }


  loadUser(email: string) {
    this.userService.getUserByEmail(email).subscribe({
      next: (res) => {
        this.user = res.data;
      },
      error: (err) => this.toastr.error('Failed to load user')
    });
  }

  getRoleName(roleId: number | undefined) {
    const roles: Record<number, string> = { 1: 'Admin', 2: 'Operator', 3: 'Driver' };
    return roles[roleId || 0] || 'Unknown';
  }

  get dateOfBirthString(): string | null {
    if (!this.user.dateOfBirth) return null;
    const dob = new Date(this.user.dateOfBirth);
    const year = dob.getFullYear();
    const month = (dob.getMonth() + 1).toString().padStart(2, '0'); // months are 0-based
    const day = dob.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }



  onPhotoSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      // Upload logic here
      const reader = new FileReader();
      reader.onload = e => this.user.ProfilePhotoUrl = reader.result as string;
      reader.readAsDataURL(file);
    }
  }

  saveProfile() {
    this.userService.updateProfile(this.user).subscribe({
      next: (res) => this.toastr.success(res?.message || 'Profile updated successfully'),
      error: (err) => this.toastr.error(err.error?.message || 'Failed to update profile')
    });
  }

  downloadQR(email: string) {
    this.pdfService.getStickerPdfByEmail(email).subscribe(blob => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `VID-Sticker-${Date.now()}.pdf`; // filename
      a.click();
      window.URL.revokeObjectURL(url);
    });
  }

}
