import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserService } from 'src/app/shared/user.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styles: []
})
export class RegistrationComponent implements OnInit, OnDestroy {
  
  constructor(public service: UserService, private toastr: ToastrService) { }

  ngOnInit() {
  }

  ngOnDestroy(): void {
  }

  onSubmit(){
    this.service.register().subscribe(
      (res: any) => {
        if (res.Succeeded) {
          this.service.formModel.reset();
          this.toastr.success('New user created!', 'Registration successful.');
        } else {
          res.Errors.forEach(element => {
            switch (element.code) {
              case 'DuplicateUserName':
                this.toastr.error(element.Description, 'Registration failed.');
                break;
              case 'DuplicateEmail':
                this.toastr.error(element.Description, 'Registration failed.');
                break;
            
              default:
                this.toastr.error(element.Description,'Registration failed.');
                break;
            }
          });
          
        }
        
      },
      err => {
        console.log(err);
      }
    )
  }

}
