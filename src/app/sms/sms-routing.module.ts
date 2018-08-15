import { NgModule } from '@angular/core';
import { Routes,RouterModule } from '@angular/router';

import { SmsComponent } from './sms.component';
import { VerifyComponent } from './smsVerify/verify.component';
import { AdduserComponent } from './addUser/adduser.component';

const routes:Routes = [
	{
		path:'',
		component:SmsComponent,
    children:[
    	{
    		path:'',
    		redirectTo:'smsVerify',
    		pathMatch:'full'
			},
      {
        path: 'smsVerify',
        component: VerifyComponent,
        // canActivate:[AuthGuard]
      },
      {
        path: 'addUser',
        component: AdduserComponent,
        // canActivate:[AuthGuard]
      },
			{
				path: '**',
        redirectTo:'smsVerify',
        pathMatch:'full'
			},
    ]
	}
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports:[
  	RouterModule
  ]
})
export class SmsRoutingModule { }
