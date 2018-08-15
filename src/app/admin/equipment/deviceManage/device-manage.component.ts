import { Component, OnInit } from '@angular/core';
import { EquipService } from '../../service/equip.service';

@Component({
  selector: 'app-device-manage',
  templateUrl: './device-manage.component.html',
  styleUrls: ['./device-manage.component.css']
})
export class DeviceManageComponent implements OnInit {

  constructor(private eqService:EquipService) { 
    console.log('construct');
  }

  heads:any = [
  	{label:"序号",field:'num'},
    {label:"编号",field:'deviceCode'},
    {label:"操作",field:'operate',operate:true,operations:['修改','删除']}
  ];

  // 设备列表
  devices:any;
  // 是否显示弹窗
  showModal:boolean = false;
  modalType:string = '';

  ngOnInit() {
    console.log('init');
  	this.getDevices(1);
  }

  //获取设备列表
  getDevices(page){
    let size = 10;
    this.showLoading();
    this.eqService.getData('/device/getAll?pageNum='+page+'&eachNum='+size).subscribe(res=>{
      console.log('all device:',res);
      this.totalPage = res.pageCount;
      let devices = res.devices;
      this.eqService.getData('/device/getNoBinding').subscribe(noBind=>{
      	console.log('noBind device:',noBind);
      	this.devices = devices.map((item,index)=>{
      		item.num = this.eqService.addZero((page-1)*size+(index+1),2);
      		item.status = noBind.indexOf(item.deviceCode)>-1?'未绑定':'已绑定';
      		return item;
      	});
      	this.hideLoading();
      	console.log(this.devices)
      });
    });
  }

  getOperateEvent(e){
    console.log(e);
    switch (e.option) {
      case "修改":
        this.modify(e.data);
        break;
      case "删除":
        this.delOne(e.data);
        break;
      
      default:
        // code...
        break;
    }
  }

  //分页
  pageSize:number = 5;
  totalPage:number = 1;
  nowPage:number = 1;
  getPage(e){
    // console.log(e);
    this.nowPage = e.page;
    this.getDevices(e.page);
  }

  //跳到第几页,并获取该页数据
  jumpToPage(page){
    this.nowPage = page;
    this.getDevices(page);
  }

  //是否显示加载动画
  ifShowLoading:boolean = false;
  showLoading(){this.ifShowLoading=false;}
  hideLoading(){this.ifShowLoading=false;}

  // 添加设备
  addInfo:any = {};
  initAddInfo(){
    this.addInfo = {
      deviceCode:''
    }
  }
  addNew(){
    console.log(this.addInfo);
    this.eqService.postFormData('/device/add',this.addInfo).subscribe(res=>{
      console.log('addNewDevice',res);
      if(res.status==0){
        alert('添加成功！');
        this.showModal = false;
        this.jumpToPage(this.nowPage);
      }
    });
  }

  // 删除设备
  delOne(data){
    if(!confirm('确认要删除 “ '+data.deviceCode+' ” 吗？')){return}
    this.eqService.postFormData('/device/delete',{deviceCode:data.deviceCode}).subscribe(res=>{
      console.log('delDevice',res);
      if(res.status==0){
        alert('删除成功！');
        if(this.devices.length<=1){
          this.jumpToPage(this.nowPage-1?this.nowPage-1:1);
        }else{
          this.jumpToPage(this.nowPage);
        }
      }
    });
  }

  // 修改设备
  modifyInfo:any = {};
  modify(data){
    this.modifyInfo = JSON.parse(JSON.stringify(data));
    this.showModal = true;
    this.modalType = 'modify';
  }
  confirmModify(){
    console.log('modifyDevice',this.modifyInfo);
    this.eqService.postFormData('/device/modify',{deviceId:this.modifyInfo['deviceId'],deviceCode:this.modifyInfo['deviceCode']}).subscribe(res=>{
      console.log('modifyDevice',res);
      if(res.status==0){
        alert('修改成功！');
        this.showModal = false;
        this.jumpToPage(this.nowPage);
      }
    });
  }

}
