import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MaterialModule } from '../../../../../shared/material/material.module';
import { ROLEID_TO_ROLE } from '../../../../../shared/constants/role';
import { BLOOD_GROUPS } from '../../../../../shared/constants/blood-group';

@Component({
  selector: 'app-add-driver-dialog',
  imports: [MaterialModule],
  templateUrl: './add-driver-dialog.component.html',
  styleUrl: './add-driver-dialog.component.scss'
})
export class AddDriverDialogComponent {
  BLOOD_GROUPS = BLOOD_GROUPS;
  ROLEID_TO_ROLE = ROLEID_TO_ROLE;

  constructor(
    public dialogRef: MatDialogRef<AddDriverDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  save() {
    this.dialogRef.close(this.data);
  }
}
