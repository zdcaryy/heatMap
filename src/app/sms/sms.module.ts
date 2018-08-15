import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { SmsRoutingModule } from './sms-routing.module';

import { AdduserComponent } from './addUser/adduser.component';
import { VerifyComponent } from './smsVerify/verify.component';
import { SmsComponent } from './sms.component'; 

@NgModule({
  imports: [
    CommonModule,
    SmsRoutingModule,
    FormsModule
  ],
  declarations: [
  	AdduserComponent,
  	VerifyComponent,
  	SmsComponent
  ]
})
export class SmsModule { }
