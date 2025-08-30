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

@Component({
  selector: 'app-drivers',
  imports: [MaterialModule],
  templateUrl: './drivers.component.html',
  styleUrls: ['./drivers.component.scss']
})
export class DriversComponent implements OnInit {
  displayedColumns: string[] = [
    'fullName', 'email', 'dateOfBirth', 'bloodGroup', 'status', 'actions'
  ];
  dataSource = new MatTableDataSource<any>([]);
  filterValue = '';

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

  mapBloodGroup(id: number): string {
    const groups: any = {
      1: 'A+', 2: 'A-', 3: 'B+', 4: 'B-',
      5: 'O+', 6: 'O-', 7: 'AB+', 8: 'AB-'
    };
    return groups[id] || 'Unknown';
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