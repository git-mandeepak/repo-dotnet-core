import { NgModule } from '@angular/core';
import {RouterModule, Routes} from '@angular/router'
import { UserComponent } from './user/user.component';
import { RegistrationComponent } from './user/registration/registration.component';
import { LoginComponent } from './user/login/login.component';
import { PaymentDetailsComponent } from './payment-details/payment-details.component';
import { AuthGuard } from './auth/auth.guard';
import { ForbiddenComponent } from './forbidden/forbidden.component';
import { AdminPanelComponent } from './admin-panel/admin-panel.component';

const routes: Routes = [
  {path:'', redirectTo:'/user/login', pathMatch:'full'},
  {
    path:'user', 
    component:UserComponent,
    children:[
      {path:'register', component:RegistrationComponent},
      {path:'login', component:LoginComponent}
    ]
  },
  {path:'home', component: PaymentDetailsComponent, canActivate:[AuthGuard]},
  {path:'forbidden', component: ForbiddenComponent},
  {path:'adminpanel', component: AdminPanelComponent, canActivate:[AuthGuard], data: {permittedRoles:['Admin']}}
]


@NgModule({
  declarations: [],
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule { }
