import { Component, OnInit, ViewChild } from '@angular/core';
import { MaterialModule } from '../../../shared/material/material.module';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { AdminService } from '../../../core/services/admin.service';
import { UserService } from '../../../core/services/user.service';

@Component({
  selector: 'app-drivers',
  imports: [MaterialModule],
  templateUrl: './drivers.component.html',
  styleUrl: './drivers.component.scss'
})
export class DriversComponent implements OnInit {
  displayedColumns: string[] = [
    'fullName', 'email', 'dateOfBirth', 'bloodGroup', 'status', 'actions'
  ];
  dataSource = new MatTableDataSource<any>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private adminService: AdminService,
    private userService: UserService,
    private dialog: MatDialog,
    private toastr: ToastrService
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

  mapBloodGroup(id: number): string {
    const groups: any = {
      1: 'A+', 2: 'A-', 3: 'B+', 4: 'B-',
      5: 'O+', 6: 'O-', 7: 'AB+', 8: 'AB-'
    };
    return groups[id] || 'Unknown';
  }

  viewDriver(driver: any) {
    // this.dialog.open(ViewDriverDialogComponent, { data: driver });
  }

  editDriver(driver: any) {
    // const dialogRef = this.dialog.open(EditDriverDialogComponent, { data: driver });
    // dialogRef.afterClosed().subscribe((updated) => {
    //   if (updated) this.loadDrivers();
    // });
  }

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

  verifyDriver(driver: any) {
    // open OTP modal (Material Dialog)
  }

  showQR(driver: any) {
    // this.driverService.generateQRCode(driver.virtualNumber).subscribe((res) => {
    //   this.dialog.open(QRDialogComponent, { data: res.qrCodeBase64 });
    // });
  }

  downloadPDF(driver: any) {
    window.open(`/api/Driver/Generate-Driver-Pdf/${driver.virtualNumber}`, '_blank');
  }
}