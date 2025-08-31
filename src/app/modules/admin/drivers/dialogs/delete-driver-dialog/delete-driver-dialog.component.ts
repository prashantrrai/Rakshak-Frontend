import { Component, Inject } from '@angular/core';
import { MaterialModule } from '../../../../../shared/material/material.module';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-driver-dialog',
  imports: [MaterialModule],
  templateUrl: './delete-driver-dialog.component.html',
  styleUrl: './delete-driver-dialog.component.scss'
})
export class DeleteDriverDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<DeleteDriverDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }
}
