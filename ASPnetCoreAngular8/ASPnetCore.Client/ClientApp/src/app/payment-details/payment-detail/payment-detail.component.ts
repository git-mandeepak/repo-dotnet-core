import { Component, OnInit } from '@angular/core';
import {ToastrService} from 'ngx-toastr'

import { PaymentDetailService } from 'src/app/shared/payment-detail.service';
import { NgForm } from '@angular/forms';
import { PaymentDetail } from 'src/app/shared/payment-detail.model';

@Component({
  selector: 'app-payment-detail',
  templateUrl: './payment-detail.component.html',
  styles: []
})
export class PaymentDetailComponent implements OnInit {
  
  private paymentDetails: PaymentDetail[];

  constructor(public service: PaymentDetailService, private toastr: ToastrService) {}

  ngOnInit() {
    this.resetForm();
  }

  resetForm(form?: NgForm) {
    if (form != null)
      form.resetForm();

    this.service.formData = {
      PMId: 0,
      CardOwnerName: "",
      CardNumber: "",
      ExpirationDate: "",
      CVV: ""
    };
  }

  onSubmit(form: NgForm){
    if(form.value.PMId === 0){
      this.insertRecord(form);
    }
    else{
      this.updateRecord(form);
    }
  }

  insertRecord(form:NgForm){
    console.log(form.value);
    this.service.postPaymentDetai(form.value).subscribe(
      res => {
        this.resetForm(form);
        this.toastr.success("Data Saved Successfully", "Message");
      },
      err => {
        console.log(err);
        this.toastr.error("Error Occured while saving: " + err , "Error");
      }
    );
  }

  updateRecord(form:NgForm){
    this.service.putPaymentDetail(form.value).subscribe(
      res => {
        this.resetForm(form);
        this.toastr.success("Data Updated Successfully", "Message");
        this.service.refreshList();
      },
      err => {
        console.log(err);
        this.toastr.error("Error Occured while updating: " + err , "Error");
      }
    );
  }

}
