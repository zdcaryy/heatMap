import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminComponent } from './admin.component';
import { AdminRoutingModule } from './/admin-routing.module';

import { TableComponent } from './share/table/table.component';

import { IndexComponent } from './index/index.component';

import { EquipAddComponent } from './equipment/equipAdd/equip-add.component';
import { EquipManageComponent } from './equipment/equipManage/equip-manage.component';

import { UserAddComponent } from './user/userAdd/user-add.component';
import { UserManageComponent } from './user/userManage/user-manage.component';
import { DataCompareComponent } from './data/data-compare/data-compare.component';

import {NgxEchartsModule} from 'ngx-echarts';

@NgModule({
  imports: [
    CommonModule,
    AdminRoutingModule,
    NgxEchartsModule
  ],
  declarations: [
  	AdminComponent,
  	EquipAddComponent,
  	EquipManageComponent,
  	TableComponent,
  	IndexComponent,
  	UserAddComponent,
  	UserManageComponent,
  	DataCompareComponent,
  ]
})
export class AdminModule { }
