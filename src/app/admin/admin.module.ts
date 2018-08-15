import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from "@angular/forms";

import { AdminComponent } from './admin.component';
import { AdminRoutingModule } from './/admin-routing.module';

import { TableComponent } from './share/table/table.component';

import { IndexComponent } from './index/index.component';

import { CameraAddComponent } from './equipment/cameraAdd/camera-add.component';
import { CameraManageComponent } from './equipment/cameraManage/camera-manage.component';

import { ScalingDirective } from './share/imgScaling/scaling.directive';

import { UserAddComponent } from './user/userAdd/user-add.component';
import { UserManageComponent } from './user/userManage/user-manage.component';
import { DataCompareComponent } from './data/dataCompare/data-compare.component';
import { DataShowComponent } from './data/dataShow/data-show.component';

import { NgxEchartsModule } from 'ngx-echarts';

import { UserService } from "./service/user.service";
import { EquipService } from './service/equip.service';
import { DataService } from './service/data.service';
import { IndexService } from "./service/index.service";

import { PaginationComponent } from './share/pagination/pagination.component';
import { LoadingComponent } from './share/loading/loading.component';
import { DeviceManageComponent } from './equipment/deviceManage/device-manage.component';
import { MapAddComponent } from './map/map-add.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    AdminRoutingModule,
    NgxEchartsModule,
  ],
  declarations: [
  	AdminComponent,
  	CameraAddComponent,
  	CameraManageComponent,
  	TableComponent,
  	IndexComponent,
    ScalingDirective,
  	UserAddComponent,
  	UserManageComponent,
  	DataCompareComponent,
    DataShowComponent,
    PaginationComponent,
    LoadingComponent,
    DeviceManageComponent,
    MapAddComponent
	],
	providers: [
    UserService,
    EquipService,
    DataService,
    IndexService
	]
})
export class AdminModule { }
