import { NgModule } from '@angular/core';
import { Routes,RouterModule } from '@angular/router';
import { AuthGuard } from './auth-guard.service';
import { AuthService } from './auth.service';

import { LoginComponent } from "./login/login.component";
const routes:Routes = [
	{
		path:'',
		redirectTo:'admin',
    pathMatch:'full'
	},
  {
    path:'admin',
    loadChildren: './admin/admin.module#AdminModule',
    // canActivateChild:[AuthGuard]
  },
  {
    path:'sms',
    loadChildren: './sms/sms.module#SmsModule'
  },
  {
    path: 'login',
    component: LoginComponent
  }
];

@NgModule({
  imports: [
  	RouterModule.forRoot(routes)
  ],
  exports:[
  	RouterModule
  ],
  providers: [
    AuthGuard,
    AuthService
  ]
})
export class AppRoutingModule { }
