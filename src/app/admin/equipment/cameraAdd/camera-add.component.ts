import { Component, OnInit, ElementRef, Renderer2 } from '@angular/core';
import { EquipService } from '../../service/equip.service';

@Component({
  selector: 'app-camera-add',
  templateUrl: './camera-add.component.html',
  styleUrls: ['./camera-add.component.css']
})
export class CameraAddComponent implements OnInit {

  constructor(private el:ElementRef,private ren2:Renderer2,private eqService:EquipService) { console.log('construct')}

  imgUrl:string = './assets/img/map.png';

  //config中所有值都有默认值，都可以不写
  config:object = {
  	scaling:true,//是否启用缩放，默认true
  	drag:true, //是否启用拖动，默认true
  	scaleStep:0.15,//每滚动一次缩放多少，默认0.15，即 15%
  	scaleMax:3,//能放大的最大倍数--相对于图片的原始像素，默认 3 ，即 300%
  	scaleMin:0.2//能缩小的最小倍数--相对于图片的原始像素，默认 0.2，即 20%
  }

  //添加设备的信息
  addInfo:any = {};
  //是否显示下拉菜单
  showDrop:boolean = false;

  ngOnInit() {
    console.log('init')
    // this.imgUrl = this.eqService.getMapSrc();
  }

  initAddInfo(){
    this.addInfo = {
      code:'',
      deviceCode:'',
      area:'',
      location:'',
      gps:''
    }
  }

  private scalingBox:any;
  getBox(box){
    console.log('img onload');
    this.scalingBox = box;
    this.initAddBox(box);
    this.showAllCameras();

    // 清除box的默认右键菜单
    box.oncontextmenu = function(e){
      //input框允许右键菜单
      if(e.target.nodeName.toLowerCase()=='input'){return};
      e.preventDefault();
    }
    // 右键弹出添加框
    box.addEventListener('mousedown',(e)=>{
      if(e.target.nodeName.toLowerCase()=='img'){
        e.preventDefault();
      }
    });
    box.addEventListener('mouseup',(e)=>{
      if(e.button==2&&e.target.attributes['bg']){
        let x = e.offsetX/box.clientWidth;
        let y = e.offsetY/box.clientHeight;
        this.getNoBindDevices();
        this.setAddBox(x,y);
        this.initAddInfo();
        this.addInfo['gps'] = x+','+y;
      }
    });
    //隐藏添加框
    // box.addEventListener('click',(e)=>{
    //   if(e.target.attributes['bg']){
    //     this.hideAddBox();
    //   }
    // })
  }

  // 显示所有已有的设备
  showAllCameras(){
    this.eqService.getData('/camera/getAll').subscribe(res=>{
      console.log('showAllCameras',res);
      let cameras = res.cameras;
      cameras.map((item)=>{
        if(!item.gps){return};
        this.fixCameraOnMap(this.scalingBox,item);
      });
    });
  }

  fixCameraOnMap(ele,info){
    let pin = this.ren2.createElement('img');
    pin.src = './assets/img/pin.png';
    pin.className = 'pins';
    let gps = info.gps.split(',');
    pin.style.left = gps[0]*100+'%';
    pin.style.top = gps[1]*100+'%';
    pin.title = '编号：\r'+info.code;
    this.ren2.appendChild(ele,pin);
  }


  private addBox;
  private addPin;
  initAddBox(ele){
    this.addBox = this.el.nativeElement.querySelector('.addBox');
    this.addPin = this.el.nativeElement.querySelector('.addPin');
    ele.appendChild(this.addBox);
    ele.appendChild(this.addPin);
    //点击空白关闭下拉菜单
    let container = this.el.nativeElement.querySelector('.myContainer');
    container.addEventListener('mousedown',e =>{
      this.showDrop = false;
    });
  }

  setAddBox(x:number,y:number){
    this.addBox.style.display = 'block';
    this.addBox.style.left = x*100+'%';
    this.addBox.style.top = y*100+'%';

    this.addPin.style.display = 'block';
    this.addPin.style.left = x*100+'%';
    this.addPin.style.top = y*100+'%';
  }
  hideAddBox(){
    this.addBox.style.display = 'none';
    this.addPin.style.display = 'none';
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

  //添加设备
  addCamera(){
    console.log(this.addInfo);
    this.eqService.postFormData('/camera/add',this.addInfo).subscribe(res=>{
      console.log('addCamera',res);
      if(res.status==0){
        alert('添加成功！');
        this.hideAddBox();
        this.showAllCameras();
      }
    });
  }

}
