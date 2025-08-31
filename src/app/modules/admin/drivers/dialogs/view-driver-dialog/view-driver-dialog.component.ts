import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MaterialModule } from '../../../../../shared/material/material.module';
import { BLOOD_GROUPS } from '../../../../../shared/constants/blood-group';
import { ROLEID_TO_ROLE } from '../../../../../shared/constants/role';

@Component({
  selector: 'app-view-driver-dialog',
  imports: [MaterialModule],
  templateUrl: './view-driver-dialog.component.html',
  styleUrl: './view-driver-dialog.component.scss'
})
export class ViewDriverDialogComponent {
  bloodGroupName: string = '';

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) { }

  getBloodGroupName(id: number): string {
    const group = BLOOD_GROUPS.find(bg => bg.id === id);
    return group ? group.name : '';
  }

  getRoleName(id: number): string {
    const role = ROLEID_TO_ROLE.find(role => role.id === id);
    return role ? role.name : '';
  }
}
