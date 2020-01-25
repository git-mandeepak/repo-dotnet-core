import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/shared/user.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: []
})
export class LoginComponent implements OnInit {
  unauthorisedUser: boolean = false;
  constructor(public service: UserService, private toastr: ToastrService, private router: Router) { }

  ngOnInit() {
    if(localStorage.getItem('token') != null){
      this.router.navigate(['/home']);
    }
  }

  onSubmit(){
    this.service.login().subscribe(
      (res: any) => {
        this.service.loginFormModel.reset();
        this.toastr.success('Login Successfull', 'Login');
        this.unauthorisedUser = false;
        //debugger;
        //console.log(res);
        localStorage.setItem('token', res.token)
        this.router.navigateByUrl('/home')
      },
      (err: any) => {
        if(err.status == 401){
          this.unauthorisedUser = true;
          this.toastr.error(err.error.message, 'Error');
        }
      }
    )
  }

}
