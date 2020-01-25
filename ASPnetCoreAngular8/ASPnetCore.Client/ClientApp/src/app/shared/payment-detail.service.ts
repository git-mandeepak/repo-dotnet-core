import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http'
import {map} from 'rxjs/operators'

import { PaymentDetail } from './payment-detail.model';
import {environment} from '../../environments/environment'

@Injectable({
  providedIn: 'root'
})
export class PaymentDetailService {
  public list: PaymentDetail[];
  public formData: PaymentDetail;
  readonly rootURL: string = environment.apiRootUrl;

  constructor(private httpClient: HttpClient) { }

  postPaymentDetai(data: PaymentDetail){
    return this.httpClient.post(this.rootURL + "/PaymentDetail/add", data);
  }

  putPaymentDetail(data: PaymentDetail){
    return this.httpClient.put(this.rootURL + "/PaymentDetail/update/" + data.PMId, data);
  }

  refreshList(){
    this.httpClient.get(this.rootURL + "/PaymentDetail/get")
    .subscribe(
      res => {
        this.list = res as PaymentDetail[];
      },
      err => {
        console.log(err);
      }
    )
  }
}
