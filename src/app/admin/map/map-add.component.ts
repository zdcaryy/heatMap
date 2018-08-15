import { Component, OnInit } from '@angular/core';
import { EquipService } from '../service/equip.service';

@Component({
  selector: 'app-map-add',
  templateUrl: './map-add.component.html',
  styleUrls: ['./map-add.component.css']
})
export class MapAddComponent implements OnInit {

  constructor(private eqSevice:EquipService) { }

  ngOnInit() {
  }

  map:File = null;
  allowedType:string[] = ['image/png','image/jpeg','image/jpg'];

  chooseMap(map){
  	if(!map.length){return} //chrome中，点取消也会触发 change
    let rightType = this.allowedType.indexOf(map[0].type.toLowerCase()) >-1 ?true:false;
    if(!rightType){
      alert('请上传 jpg | png 类型的图片！');
      return;
    }
    if(map[0].size>104857600){
      alert('请上传小于100M的图片！');
      return;
    }
    this.map = map[0];
  }

  uploadMap(){
    if(!this.map){return};
  	if(!confirm('上传新地图将清空现有的摄像头信息，确认要继续？')){return};
  	console.log(this.map);
  	let data = new FormData();
  	data.append('file',this.map);
  	this.eqSevice.upFile('/map/fileUpload',data).subscribe(res=>{
  		console.log(res);
      if(res.status==0){
        alert('上传成功！');
      }
  	});
  }

  file2url(file){
  	let url = URL.createObjectURL(file);
  	console.log(url);
  }

}
