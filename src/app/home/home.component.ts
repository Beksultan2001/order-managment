import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DetailFormComponent } from '../detail-form/detail-form.component';
import { OrderService } from '../services/order.service';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { CoreService } from '../core/core.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  currentPage = 0;
  perPage = 5;
  totalPages!: number;

  displayedColumns: string[] = [
    'id',
    'name',
    'quantity',
    'price',
    'dob',
    'action',
  ];

  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private _dialog: MatDialog,
    private _orderService: OrderService,
    private _coreService: CoreService
  ) {}

  openDetailForm() {
    this._dialog.open(DetailFormComponent);
  }

  getOrderList() {
    this._orderService.getOrderList(this.currentPage, this.perPage).subscribe({
      next: (res) => {
        this.dataSource = new MatTableDataSource(res);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      },
      error: (err) => console.log(err),
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  deleteEmployee(id: number) {
    this._orderService.deleteOrder(id).subscribe({
      next: (res) => {
        this._coreService.openSnackBar('Order deleted');
        this.getOrderList();
      },
      error: console.log,
    });
  }

  openEditForm(data: any) {
    this._dialog.open(DetailFormComponent, {
      data,
    });
  }

  handlePageEvent($event: PageEvent) {
    this.currentPage = $event.pageIndex;
  }

  getTotalPaginationList() {
    this._orderService.getTotalPaginationList().subscribe({
      next: (res) => {
        this.totalPages = Math.floor(res.length / this.perPage);
      },
      error: console.log,
    });
  }

  ngOnInit(): void {
    this.getTotalPaginationList();
    this.getOrderList();
    this._orderService.orderListUpdated.subscribe(() => {
      this.getOrderList();
    });
  }
}
