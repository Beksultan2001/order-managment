import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CoreService } from '../core/core.service';
import { OrderService } from '../services/order.service';

@Component({
  selector: 'detail-form',
  templateUrl: './detail-form.component.html',
  styleUrls: ['./detail-form.component.scss'],
})
export class DetailFormComponent implements OnInit {
  orderForm: FormGroup;

  constructor(
    private _fb: FormBuilder,
    private _orderService: OrderService,
    private _dialogRef: MatDialogRef<DetailFormComponent>,
    private _statusBar: CoreService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.orderForm = this._fb.group({
      name: '',
      quantity: '',
      price: '',
      dob: '',
    });
  }

  ngOnInit(): void {
    this.orderForm.patchValue(this.data);
  }

  onFormSubmit() {
    if (this.orderForm.valid) {
      if (this.data) {
        this._orderService
          .updateOrder(this.data.id, this.orderForm.value)
          .subscribe({
            next: (val: any) => {
              this._statusBar.openSnackBar('Order detail updated!');
              this._dialogRef.close(true);
              this._orderService.orderListUpdated.emit();
            },
            error: (err: any) => {
              console.error(err);
            },
          });
      } else {
        this._orderService.addOrder(this.orderForm.value).subscribe({
          next: (val: any) => {
            this._statusBar.openSnackBar('Order added successfully');
            this._dialogRef.close(true);
            this._orderService.orderListUpdated.emit();
          },
          error: (err: any) => {
            console.error(err);
          },
        });
      }
    }
  }
}
