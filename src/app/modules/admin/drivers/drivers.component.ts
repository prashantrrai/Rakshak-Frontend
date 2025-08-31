import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { AdminService } from '../../../core/services/admin.service';
import { UserService } from '../../../core/services/user.service';
import * as XLSX from 'xlsx'; // Excel export
import { MaterialModule } from '../../../shared/material/material.module';
import { ViewDriverDialogComponent } from './dialogs/view-driver-dialog/view-driver-dialog.component';
import { EditDriverDialogComponent } from './dialogs/edit-driver-dialog/edit-driver-dialog.component';
import { DeleteDriverDialogComponent } from './dialogs/delete-driver-dialog/delete-driver-dialog.component';
import { OtpDriverDialogComponent } from './dialogs/otp-driver-dialog/otp-driver-dialog.component';
import { QrDriverDialogComponent } from './dialogs/qr-driver-dialog/qr-driver-dialog.component';
import { BLOOD_GROUPS } from '../../../shared/constants/blood-group';
import { DateOfBirthUtils } from '../../../shared/utility/dateofbirth.utils';
import { ROLEID_TO_ROLE } from '../../../shared/constants/role';
import { AddDriverDialogComponent } from './dialogs/add-driver-dialog/add-driver-dialog.component';

@Component({
  selector: 'app-drivers',
  imports: [MaterialModule],
  templateUrl: './drivers.component.html',
  styleUrls: ['./drivers.component.scss']
})
export class DriversComponent implements OnInit {
  displayedColumns: string[] = [
    'fullName', 'email', 'dateOfBirth', 'bloodGroup', 'status', 'role', 'actions'
  ];
  dataSource = new MatTableDataSource<any>([]);
  filterValue = '';

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private adminService: AdminService,
    private userService: UserService,
    private dialog: MatDialog,
    private toastr: ToastrService,
  ) { }

  ngOnInit(): void {
    this.loadDrivers();
  }

  loadDrivers() {
    this.adminService.getUserList().subscribe({
      next: (res: any) => {
        this.dataSource.data = res.data || [];
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error: () => this.toastr.error('Failed to load drivers')
    });
  }

  openAddDriver() {
    const dialogRef = this.dialog.open(AddDriverDialogComponent, {
      width: '500px',
      data: []
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.userService.registerUser(result?.email).subscribe({
          next: (res) => {
            this.toastr.success(res?.message || 'User Added successfully');
            this.loadDrivers();
          },
          error: (err) => {
            this.toastr.error(err.error?.message || 'Failed to Add user');
          }
        });
      }
    });
  }

  openViewDriver(driver: any) {
    this.dialog.open(ViewDriverDialogComponent, {
      width: '500px',
      data: driver
    });
  }

  openEditDriver(driver: any) {
    const dialogRef = this.dialog.open(EditDriverDialogComponent, {
      width: '600px',
      data: { ...driver } // pass a copy so original isn’t changed until saved
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {

        const payload = {
          ...result,
          dateOfBirth: DateOfBirthUtils.toDateString(result.dateOfBirth)
        };

        this.userService.updateProfile(payload).subscribe({
          next: (res) => {
            this.toastr.success(res?.message || 'Driver updated successfully');
            this.loadDrivers();
          },
          error: (err) => {
            this.toastr.error(err.error?.message || 'Failed to update driver');
          }
        });
      }
    });
  }

  openDeleteDriver(driver: any) {
    const dialogRef = this.dialog.open(DeleteDriverDialogComponent, {
      width: '400px',
      data: driver
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Confirmed delete for:', driver);
        // TODO: call delete API here

        this.userService.deleteUser(result.email).subscribe({
          next: (res) => {
            this.toastr.success(res?.message || 'Driver Deleted Successfully');
            this.loadDrivers();
          },
          error: (err) => {
            this.toastr.error(err.error?.message || 'Failed to delete driver');
          }
        });
      }
    });
  }

  openOtpDialog(driver: any) {
    const dialogRef = this.dialog.open(OtpDriverDialogComponent, {
      width: '400px',
      data: driver
    });

    dialogRef.afterClosed().subscribe(otp => {
      if (otp) {
        console.log('OTP entered:', otp);
        // TODO: call verify API with otp
      }
    });
  }

  openQrDialog(driver: any) {
    this.dialog.open(QrDriverDialogComponent, {
      width: '500px',
      data: { qrUrl: driver.qrUrl }  // driver.qrUrl from API
    });
  }

  applyFilter(event: Event) {
    this.filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.dataSource.filter = this.filterValue;
  }

  clearFilter() {
    this.filterValue = '';
    this.dataSource.filter = '';
  }

  exportToExcel() {
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.dataSource.filteredData);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Drivers');
    XLSX.writeFile(wb, 'Drivers_List.xlsx');
  }

  getBloodGroupName(id: number): string {
    const group = BLOOD_GROUPS.find(bg => bg.id === id);
    return group ? group.name : '';
  }

  getRoleName(id: number): string {
    const role = ROLEID_TO_ROLE.find(role => role.id === id);
    return role ? role.name : '';
  }

  // Actions
  viewDriver(driver: any) { }
  editDriver(driver: any) { }
  deleteDriver(driver: any) {
    if (confirm(`Delete ${driver.fullName}?`)) {
      this.userService.deleteUser(driver.virtualNumber).subscribe({
        next: () => {
          this.toastr.success('Driver deleted');
          this.loadDrivers();
        },
        error: () => this.toastr.error('Delete failed')
      });
    }
  }
  verifyDriver(driver: any) { }
  showQR(driver: any) { }
  downloadPDF(driver: any) {
    window.open(`/api/Driver/Generate-Driver-Pdf/${driver.virtualNumber}`, '_blank');
  }
}