import { Component, OnInit } from '@angular/core';
import { PaymentDetailService } from '../shared/payment-detail.service';
import { Router } from '@angular/router';
import { UserService } from '../shared/user.service';
import { UserModel } from '../shared/user-model.model';



@Component({
  selector: 'app-payment-details',
  templateUrl: './payment-details.component.html',
  styles: []
})
export class PaymentDetailsComponent implements OnInit {
  
  public userModel: UserModel;
  
  constructor(public service: UserService, public router: Router) { 
    this.userModel = new UserModel();
  }

  ngOnInit() {
    this.service.getUserProfile().subscribe(
      (res: UserModel) => {
        this.userModel = res;
      },
      err => {
        console.log(err);
      },
    );
  }

  onLogout(){
    localStorage.removeItem('token');
    this.router.navigate(['/user/login']);
  }

}
