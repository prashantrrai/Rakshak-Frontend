import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../core/services/user.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute } from '@angular/router';
import { PdfService } from '../../../core/services/pdf.service';
import { MaterialModule } from '../../../shared/material/material.module';
import { BLOOD_GROUPS } from '../../../shared/constants/blood-group';
import { UpdateProfileDialogComponent } from '../update-profile-dialog/update-profile-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-profile',
  imports: [MaterialModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {
  email: string = '';
  user: any = {};
  bloodGroups = BLOOD_GROUPS;

  constructor(private userService: UserService, private pdfService: PdfService, private toastr: ToastrService, private route: ActivatedRoute, private dialog: MatDialog) { }

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

  // getRoleName(roleId: number | undefined) {
  //   const roles: Record<number, string> = { 1: 'Admin', 2: 'Operator', 3: 'Driver' };
  //   return roles[roleId || 0] || 'Unknown';
  // }

  // onPhotoSelected(event: any) {
  //   const file = event.target.files[0];
  //   if (file) {
  //     // Upload logic here
  //     const reader = new FileReader();
  //     reader.onload = e => this.user.ProfilePhotoUrl = reader.result as string;
  //     reader.readAsDataURL(file);
  //   }
  // }

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

  openDialog() {
    const dialogRef = this.dialog.open(UpdateProfileDialogComponent, {
      width: '600px',
      data: { user: this.user }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadUser(this.user.email);
      }
    });
  }
}
