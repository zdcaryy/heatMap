import { NgModule } from '@angular/core';
import { Routes,RouterModule } from '@angular/router';

import { AdminComponent } from './admin.component';

import { IndexComponent } from "./index/index.component";

import { CameraAddComponent } from './equipment/cameraAdd/camera-add.component';
import { CameraManageComponent } from './equipment/cameraManage/camera-manage.component';

import { UserAddComponent } from "./user/userAdd/user-add.component";
import { UserManageComponent } from "./user/userManage/user-manage.component";

import { DataCompareComponent } from './data/dataCompare/data-compare.component';
import { DataShowComponent } from './data/dataShow/data-show.component';
import { DeviceManageComponent } from './equipment/deviceManage/device-manage.component';
import { MapAddComponent } from './map/map-add.component';


const routes:Routes = [
	{
		path:'',
		component:AdminComponent,
    children:[
    	{
    		path:'',
    		redirectTo:'index',
    		pathMatch:'full'
			},
			{
				path: 'index',
				component: IndexComponent,
        // canActivate:[AuthGuard]
			},
			{
				path: 'userAdd',
				component: UserAddComponent,
        // canActivate:[AuthGuard]
			},
			{
				path: 'userManage',
				component: UserManageComponent,
        // canActivate:[AuthGuard]
			},
			{
				path:'cameraAdd',
				component:CameraAddComponent,
        // canActivate:[AuthGuard]
			},
			{
				path:'cameraManage',
				component:CameraManageComponent,
        // canActivate:[AuthGuard]
			},
      {
        path:'dataCompare',
        component:DataCompareComponent,
        // canActivate:[AuthGuard]
      },
      {
        path:'dataShow',
        component:DataShowComponent,
        // canActivate:[AuthGuard]
      },
      {
        path:'deviceManage',
        component:DeviceManageComponent,
        // canActivate:[AuthGuard]
      },
      {
        path:'mapAdd',
        component:MapAddComponent,
        // canActivate:[AuthGuard]
      }
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
export class AdminRoutingModule { }
