import { ROLEID_TO_ROLE } from './../../../../../shared/constants/role';
import { Component, Inject } from '@angular/core';
import { MaterialModule } from '../../../../../shared/material/material.module';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BLOOD_GROUPS } from '../../../../../shared/constants/blood-group';

@Component({
  selector: 'app-edit-driver-dialog',
  imports: [MaterialModule],
  templateUrl: './edit-driver-dialog.component.html',
  styleUrl: './edit-driver-dialog.component.scss'
})
export class EditDriverDialogComponent {
  BLOOD_GROUPS = BLOOD_GROUPS;
  ROLEID_TO_ROLE = ROLEID_TO_ROLE;

  constructor(
    public dialogRef: MatDialogRef<EditDriverDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  save() {
    this.dialogRef.close(this.data);
  }
}
