import { Component, OnInit } from '@angular/core';
import { EquipService } from '../../service/equip.service';

@Component({
  selector: 'app-camera-manage',
  templateUrl: './camera-manage.component.html',
  styleUrls: ['./camera-manage.component.css']
})
export class CameraManageComponent implements OnInit {

  constructor(private eqService:EquipService) { }

  heads:any = [
  	{label:"序号",field:'num',colStyle:{width:'10%'}},
    {label:"编号",field:'code'},
    {label:"区域",field:'area'},
    {label:"位置",field:'location'},
    {label:"设备",field:'deviceCode',textConfig:{null:'未绑定'}},
    {label:"操作",field:'operate',operate:true,operations:['修改','删除']}
  ];

  cameras:any;

  showModal:boolean = false;
  showDrop:boolean = false;

  ngOnInit() {
    this.cameras = [
        {num:'01',code:'12345',area:'兵马俑一号坑',location:'南门A出口'},
        {num:'02',code:'12346',area:'兵马俑一号坑',location:'南门A出口'},
        {num:'03',code:'95543',area:'兵马俑一号坑',location:'南门A出口'},
        {num:'04',code:'12378',area:'兵马俑一号坑',location:'南门A出口'},
        {num:'05',code:'32115',area:'兵马俑一号坑',location:'南门A出口'},
        {num:'06',code:'25888',area:'兵马俑一号坑',location:'南门A出口'},
        {num:'07',code:'97756',area:'兵马俑一号坑',location:'南门A出口'},

    ];
    this.getCameras(1);
  }

  //获取摄像头列表
  getCameras(page){
    let size = 10;
    this.showLoading();
    this.eqService.getData('/camera/getAll?pageNum='+page+'&eachNum='+size).subscribe(res=>{
      this.totalPage = res.pageCount;
      this.cameras = res.cameras.map((item,index)=>{item.num = this.eqService.addZero((page-1)*size+(index+1),2);return item});
      this.hideLoading();
    });
  }

  getOperateEvent(e){
    // console.log(e);
    switch (e.option) {
      case "删除":
        this.delOne(e.data);
        break;
      
      case "修改":
        this.modify(e.data);
        break;
      
      default:
        // code...
        break;
    }
  }

  // 删除一个
  delOne(data){
    if(!confirm('确定要删除 “'+data.code+'” 吗？')){return};
    this.eqService.postFormData('/camera/delete',{code:data.code}).subscribe(res=>{
      if(res.status==0){
        alert('删除成功！');
      }else{
        alert('发生错误，请稍后再试...');
      }
      // 避免出错，只剩下一个时，删除，页数减一
      if(this.cameras.length<=1){
        this.jumpToPage(this.nowPage-1?this.nowPage-1:1);
      }else{
        this.jumpToPage(this.nowPage);
      }
    });
  }

  // 修改
  modifyInfo:any = {};
  modify(data){
    this.modifyInfo = JSON.parse(JSON.stringify(data));
    this.getNoBindDevices();
    this.showModal = true;
  }
  confirmModify(){
    let data = {
      code:this.modifyInfo['code'],
      area:this.modifyInfo['area'],
      location:this.modifyInfo['location'],
      deviceCode:this.modifyInfo['deviceCode']
    }
    console.log('confirmModify-Data',data);
    this.eqService.postFormData('/camera/modify',data).subscribe(res=>{
      console.log('confirmModify-res',res);
      if(res.status==0){
        alert('修改成功！');
        this.showModal = false;
        this.jumpToPage(this.nowPage);
      }
    });
  }

  //获取未绑定的设备列表
  noBindDevices:any[] = [];
  getNoBindDevices(){
    this.noBindDevices = [];
    this.eqService.getData('/device/getNoBinding').subscribe(res=>{
      console.log('getNoBindDevices',res);
      this.noBindDevices = res;
    });
  }

  //跳到第几页,并获取该页数据
  jumpToPage(page){
    this.nowPage = page;
    this.getCameras(page);
  }
  
  //分页
  pageSize:number = 5;
  totalPage:number = 1;
  nowPage:number = 1;
  getPage(e){
    // console.log(e);
    this.nowPage = e.page;
    this.getCameras(e.page);
  }


  //是否显示加载动画
  ifShowLoading:boolean = false;
  showLoading(){this.ifShowLoading=false;}
  hideLoading(){this.ifShowLoading=false;}

  //隐藏下拉列表
  hideDrop(){
    this.showDrop = false;
  }

}
