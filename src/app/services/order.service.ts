import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { DetailFormComponent } from '../detail-form/detail-form.component';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  orderListUpdated = new EventEmitter<void>();
  constructor(private _http: HttpClient, private dialog: MatDialog) {}

  openDetailForm() {
    this.dialog.open(DetailFormComponent);
  }

  addOrder(data: any): Observable<any> {
    return this._http.post('http://localhost:3000/orders', data);
  }

  updateOrder(id: number, data: any): Observable<any> {
    return this._http.put(`http://localhost:3000/orders/${id}`, data);
  }

  getOrderList(_page: number, _perPage: number): Observable<any> {
    return this._http.get(
      `http://localhost:3000/orders?_page=${_page}&_per_page=${_perPage}`
    );
  }

  getTotalPaginationList(): Observable<any> {
    return this._http.get(`http://localhost:3000/orders`);
  }

  deleteOrder(id: number): Observable<any> {
    return this._http.delete(`http://localhost:3000/orders/${id}`);
  }
}
