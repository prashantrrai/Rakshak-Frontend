import { Component, Inject } from '@angular/core';
import { MaterialModule } from '../../../shared/material/material.module';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BLOOD_GROUPS } from '../../../shared/constants/blood-group';
import { UserService } from '../../../core/services/user.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-update-profile-dialog',
  imports: [MaterialModule],
  templateUrl: './update-profile-dialog.component.html',
  styleUrl: './update-profile-dialog.component.scss'
})
export class UpdateProfileDialogComponent {
  user: any;
  bloodGroups = BLOOD_GROUPS;

  constructor(
    private dialogRef: MatDialogRef<UpdateProfileDialogComponent>,
    private userService: UserService,
    private toastr: ToastrService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.user = { ...data.user };
  }

  get dateOfBirthString(): string | null {
    if (!this.user.dateOfBirth) return null;

    const dob = new Date(this.user.dateOfBirth);
    const year = dob.getFullYear();
    const month = (dob.getMonth() + 1).toString().padStart(2, '0'); // 0-based
    const day = dob.getDate().toString().padStart(2, '0');

    return `${year}-${month}-${day}`; // ✅ "2001-05-02"
  }


  saveProfile() {
    const payload = {
      ...this.user,
      dateOfBirth: this.dateOfBirthString
    };
    this.userService.updateProfile(payload).subscribe({
      next: (res) => {
        this.toastr.success(res?.message || 'Profile updated successfully');
        this.dialogRef.close(true);
      },
      error: (err) =>
        this.toastr.error(err.error?.message || 'Failed to update profile')
    });
  }

  onPhotoSelected($event: Event) {
    throw new Error('Method not implemented.');
  }

  close() {
    this.dialogRef.close(false);
  }
}
