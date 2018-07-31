import { NgModule } from '@angular/core';
import { Routes,RouterModule } from '@angular/router';

import { AdminComponent } from './admin.component';

import { IndexComponent } from "./index/index.component";

import { EquipAddComponent } from './equipment/equipAdd/equip-add.component';
import { EquipManageComponent } from './equipment/equipManage/equip-manage.component';

import { UserAddComponent } from "./user/userAdd/user-add.component";
import { UserManageComponent } from "./user/userManage/user-manage.component";

import{DataCompareComponent} from './data/data-compare/data-compare.component';

const routes:Routes = [
	{
		path:'',
		component:AdminComponent,
    children:[
    	{
    		path:'',
    		redirectTo:'equipAdd',
    		pathMatch:'full'
			},
			{
				path: 'index',
				component: IndexComponent
			},
			{
				path: 'userAdd',
				component: UserAddComponent
			},
			{
				path: 'userManage',
				component: UserManageComponent
			},
    	{
    		path:'equipAdd',
    		component:EquipAddComponent
    	},
    	{
    		path:'equipManage',
    		component:EquipManageComponent
    	},
      {
        path:'dataCompare',
        component:DataCompareComponent
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
